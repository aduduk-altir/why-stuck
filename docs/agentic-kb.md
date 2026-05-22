# Agentic KB Retrieval — "Later" Plan

> **Status: not implemented.** Deferred during the hackathon. Revisit when the trigger
> conditions below fire.

## The idea

Instead of stuffing every file in `knowledge-base/` into the system prompt on every
request, give the model a `readKbFile(name)` tool and a TOC. The model decides which
docs (if any) are relevant to the user's question + the current `uiContext`, calls the
tool to fetch them, then answers.

This is "agentic" KB retrieval, not RAG — there are no embeddings, no similarity search.
The selection is done by the model itself using the TOC's one-line descriptions. It's
the same constraint as the hackathon plan (no vector DB), just with the model in the
loop instead of `fs.readFileSync`-everything.

## Why deferred

- KB is 3 small files (~7-10k tokens). Fits in context easily; no bloat.
- Adds 1 extra round-trip on any turn that needs a doc → roughly doubles first-token latency.
- The demo wow factor is `uiContext` already knowing what's on screen, not the retrieval mechanism.
- Hackathon time better spent on UX (push-to-talk, proactive triggers, action history).

## Revisit when any of these fire

- KB grows past ~6-8 files OR holds docs over ~3k tokens each (process docs, runbooks).
- Prompt token cost / latency starts mattering more than it does for a demo.
- We want a visible "agent is reading X" trace as demo theater (see the optional section
  at the bottom).

## Architecture

```
┌─────────────────┐    ┌─────────────────────┐    ┌──────────────────────┐
│ system prompt   │ ──▶│ model picks doc(s)  │ ──▶│ tool: readKbFile     │
│ + 00-index.md   │    │ via tool call       │    │ (whitelisted name)   │
│ (always loaded) │    └─────────────────────┘    └──────────────────────┘
└─────────────────┘             ▲                            │
                                │                            ▼
                                │            ┌──────────────────────┐
                                └────────────│ file contents as     │
                                             │ tool result          │
                                             └──────────────────────┘
                                                        │
                                                        ▼
                                             ┌──────────────────────┐
                                             │ model answers using  │
                                             │ doc(s) it fetched    │
                                             └──────────────────────┘
```

### Always in the system prompt

- Agent role + tone.
- `uiContext` (URL, formState, errors, actionHistory, openModal, activeStep, forms, etc.).
- `knowledge-base/00-index.md` — TOC with one-line descriptions for every doc.

### Lazy

Everything else under `knowledge-base/`: `routing-map.md`, `form-rules.md`,
`troubleshooting.md`, and anything added later.

## Wiring sketch (AI SDK v6)

> Verify the exact API names against `node_modules/ai/docs/` at implementation time —
> AI SDK is newer than training data.

```ts
import { streamText, tool, stepCountIs, convertToModelMessages } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import fs from 'node:fs/promises';
import path from 'node:path';

const KB_DIR = path.join(process.cwd(), 'knowledge-base');
const ALLOWED = ['routing-map', 'form-rules', 'troubleshooting'] as const;

const readKbFile = tool({
  description:
    'Read one knowledge-base doc by name. Consult 00-index.md (in your system prompt) ' +
    'to pick the right one. Read at most 2 docs per turn.',
  inputSchema: z.object({
    name: z.enum(ALLOWED),
  }),
  execute: async ({ name }) => {
    return await fs.readFile(path.join(KB_DIR, `${name}.md`), 'utf8');
  },
});

const result = streamText({
  model: openai('gpt-4o-mini'),
  system: buildSystemPrompt(uiContext, indexMd),
  messages: convertToModelMessages(messages),
  tools: { readKbFile },
  stopWhen: stepCountIs(4), // cap multi-step loops
});

return result.toUIMessageStreamResponse();
```

System-prompt addition (rough):

> A table of contents is shown below. Each row lists one KB doc with a one-line
> description. When the user's question or the UI context suggests a topic covered by a
> doc, call `readKbFile({ name })` to read it before answering. Read at most 2 docs per
> turn. If nothing in the TOC is relevant, answer from the uiContext alone.

## Scope of work

1. Add tool definition + `stopWhen` to `src/app/api/chat/route.ts`. (~15 min)
2. Update the system-prompt builder to inject `00-index.md` only instead of every KB file. (~10 min)
3. Make sure `00-index.md` has tight one-line descriptions for every doc — the model picks blind from those. (~5 min)
4. Smoke test: ask a routing question, confirm only `routing-map.md` gets fetched. Ask a form question, confirm only `form-rules.md` gets fetched. (~10 min)
5. Update `docs/api-contract.md` if the response stream shape changes — tool-call parts now appear in the UIMessage stream and the client may need to handle/filter them. (~5 min)

**Budget: 45 min including debug.** If it overruns, revert — `git revert` is your friend.

## Risks

- **Tool-loop runaway.** Model could call `readKbFile` repeatedly. Mitigation: `stopWhen: stepCountIs(4)`.
- **Wrong doc picked.** Bad TOC descriptions cause bad picks. Mitigation: keep `00-index.md` tight; cap reads at 2 per turn in the tool description.
- **Client tool-part rendering.** AI SDK v6 streams emit `tool-call` and `tool-result` parts in the UIMessage. The chip1 widget currently expects only `text` parts — either filter `tool-*` parts in the widget, or render them as a one-line "Reading X…" status (see demo-theater angle).
- **Vercel cold reads.** `fs.readFile` per tool call is cheap on Vercel serverless. Don't optimize.
- **Context still has the TOC.** If the TOC itself grows huge (dozens of docs), we'd want to chunk it. Not a near-term concern.

## Optional: demo-theater angle

The tool-call trace can be *shown* in the widget as a small italic status line —
"Reading routing-map.md…" — that collapses once the answer streams. This makes the
agent's "thinking" visible and is the strongest reason to do this work for a demo.

Adds ~15 min of client work in chip1-webui: handle `tool-call` and `tool-result` parts
in the message renderer, show a one-liner per call. Brief a chip1-webui subagent if/when
we go this route.

## Related

- Current "stuff it all in" implementation: `src/app/api/chat/route.ts`.
- KB content: `knowledge-base/00-index.md`, `routing-map.md`, `form-rules.md`, `troubleshooting.md`.
- Contract doc that may need updating: `docs/api-contract.md`.
