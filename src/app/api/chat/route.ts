import fs from 'node:fs';
import path from 'node:path';
import { openai } from '@ai-sdk/openai';
import { convertToModelMessages, streamText, type UIMessage } from 'ai';
import { ChatRequestSchema, type UiContext } from '@/lib/schemas';
import { corsHeaders, handleCorsPreflight, isAllowedOrigin } from '@/lib/cors';
import { env } from '@/lib/env';

export const runtime = 'nodejs';
export const maxDuration = 30;

const KB_DIR = path.join(process.cwd(), 'knowledge-base');

function loadKnowledgeBase(): string {
  const files = fs
    .readdirSync(KB_DIR)
    .filter((f) => f.endsWith('.md'))
    .sort();

  return files
    .map((file) => {
      const body = fs.readFileSync(path.join(KB_DIR, file), 'utf8');
      return `### ${file}\n\n${body}`;
    })
    .join('\n\n---\n\n');
}

function buildSystemPrompt(kb: string, uiContext: UiContext | undefined): string {
  const uiContextBlock =
    uiContext === undefined
      ? '(no UI context provided)'
      : JSON.stringify(uiContext, null, 2);

  const trigger = uiContext?.trigger ?? 'user';
  const target = uiContext?.triggerTarget;
  const button = uiContext?.triggerButton;
  const triggerDescriptor = button
    ? `button "${button.label}" (context: ${button.context}${button.disabled ? ', disabled' : ''})`
    : target
      ? `"${target}"`
      : '';
  const proactiveBlock =
    trigger === 'user'
      ? ''
      : `
# Conversation opened proactively — IMPORTANT
This chat was NOT started by the user typing a question. The widget detected the user was stuck (trigger: ${trigger}${triggerDescriptor ? `, on ${triggerDescriptor}` : ''}) and opened this conversation on their behalf. Any "user" message you see is a synthesized placeholder, not something the user wrote. Your very first reply must lead with the diagnosis — name the blocker and the exact next action in the opening sentence. If a disabled button was rage-clicked, explain *why* it is disabled (missing required fields, wrong status, no row selected, etc.) and what to do next. Do not greet, do not say "I can help with that", do not ask "how can I help" — just diagnose.
`;

  return `You are an in-app support agent embedded inside a complex web application.
The user is stuck somewhere in a flow and needs the next concrete action to unstick them.
${proactiveBlock}
# How to read \`uiContext\`
- \`visibleButtons[]\` lists buttons currently rendered on the page as \`{ label, context, disabled? }\`. **\`disabled\` is only present when the button is disabled.** If the field is missing (or \`false\`), the button is enabled and clickable. Never tell the user a button is disabled, missing, or unavailable when its \`disabled\` flag is absent — it is enabled. If the user asks "where is X" or "X is grayed out" and the button is in \`visibleButtons\` without \`disabled: true\`, the button is available; point them at it by \`context\` (e.g. "It's on the FAB" for \`context: "fab-menu"\`).
- \`context\` tells you *where* a button lives: \`fab\` / \`fab-menu\` (the floating round button and its popover menu), \`tabs\`, \`table-toolbar\` / \`table-footer\` / \`table-row\` / \`row-menu\` / \`selection-action-bar\`, \`modal-footer\`, \`stepper-footer\`, \`header\`, \`inline\`.
- \`pageTitles\` gives heading-level identity (document title, H1, breadcrumbs, active tab) — use it to confirm what page the user is on. It does not include row or form data.
- \`actionHistory\` is the last ≤20 user actions in order (oldest → newest). Use it to reconstruct what the user just tried.

# Current UI state (scraped from the user's browser tab)
${uiContextBlock}

# Knowledge base
${kb}

# How to respond
- Reply in 1–2 short sentences. No preamble, no apologies.
- Name the exact next click, field, or value — don't summarize the problem back at them.
- If the UI state already reveals the blocker (e.g. a validation error on a specific field), address it directly without asking what they're doing.
- If the knowledge base doesn't cover their situation, say so plainly and ask one targeted question.`;
}

export async function OPTIONS(req: Request): Promise<Response> {
  return handleCorsPreflight(req);
}

export async function POST(req: Request): Promise<Response> {
  const origin = req.headers.get('origin');
  const cors = corsHeaders(origin);

  if (origin !== null && !isAllowedOrigin(origin)) {
    return new Response(JSON.stringify({ error: 'Origin not allowed' }), {
      status: 403,
      headers: { ...cors, 'Content-Type': 'application/json' },
    });
  }

  let rawBody: unknown;
  try {
    rawBody = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { ...cors, 'Content-Type': 'application/json' },
    });
  }

  const parsed = ChatRequestSchema.safeParse(rawBody);
  if (!parsed.success) {
    return new Response(
      JSON.stringify({ error: 'Invalid request', issues: parsed.error.issues }),
      {
        status: 400,
        headers: { ...cors, 'Content-Type': 'application/json' },
      },
    );
  }

  const { messages, uiContext } = parsed.data;
  const kb = loadKnowledgeBase();
  const system = buildSystemPrompt(kb, uiContext);

  const result = streamText({
    model: openai(env.OPENAI_MODEL),
    system,
    messages: await convertToModelMessages(messages as UIMessage[]),
  });

  return result.toUIMessageStreamResponse({ headers: cors });
}
