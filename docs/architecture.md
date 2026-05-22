# whyStuck — Architecture & Hackathon Plan

> 3-hour hackathon project. Speed > elegance. Bias every decision toward time-to-demo.

## The Product

An in-app AI agent that helps a user when they're stuck inside a complex form/flow.
The magic isn't that there's a chatbot — it's that the chatbot already knows what
the user is looking at and what's broken before they describe it.

## The Architecture: "Two-Repo Split"

Two separately-deployed repos, talking over HTTP:

```
┌─────────────────────────────┐         ┌────────────────────────────────┐
│  Client SPA  (Vite + React) │         │  AI Backend  (Next.js — THIS)  │
│  - existing complex app     │ ──HTTP─▶│  - /api/chat  streamText       │
│  - <AgentWidget/> floats UI │         │  - knowledge-base/*.md         │
│  - reads URL + form state   │         │    injected into system prompt │
│  - useChat() from `ai/react`│         │  - deployed to Vercel          │
└─────────────────────────────┘         └────────────────────────────────┘
```

### Why this shape and not the alternatives

| Option                                  | Verdict        | Why                                                            |
| --------------------------------------- | -------------- | -------------------------------------------------------------- |
| Single repo (bot lives in client repo)  | ✗              | Couples deploys; client doesn't need server code shipped       |
| Monorepo with `sdk` (npm) + `server`    | ✗              | Setup + internal linking + dual-deploy eats 1.5h of the 3h     |
| Agent UI inside client + separate server| ✓ **chosen**   | Fastest to demo; clean deploy split; tiny backend surface area |

## The Client (existing SPA, not this repo)

- Add `<AgentWidget />` (floating bottom-right) using shadcn/ui.
- On every user message, scrape **UI Context**:
  - `window.location.href`
  - Active form values + validation errors (e.g. from `react-hook-form` or Formik)
  - Any visible toast / error banner text
- Send context as `body.uiContext` via `useChat` from `ai/react`, pointed at this backend's `/api/chat`.

```tsx
const { messages, input, handleInputChange, handleSubmit } = useChat({
  api: 'http://localhost:3000/api/chat',
  body: { uiContext: { url, state: formState } },
});
```

## The Backend (this repo)

- Single endpoint: `src/app/api/chat/route.ts`
- Reads `knowledge-base/*.md` into memory (cold-read on each request is fine for the demo).
- Injects KB + uiContext into the system prompt.
- Streams the response back with Vercel AI SDK's `streamText`.
- CORS open to the Vite dev origin (`http://localhost:5173`) — set in `next.config.ts` or the route handler.

Sketch:

```ts
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import fs from 'node:fs';
import path from 'node:path';

const kb = fs.readFileSync(
  path.join(process.cwd(), 'knowledge-base', 'rules.md'),
  'utf8',
);

export async function POST(req: Request) {
  const { messages, uiContext } = await req.json();

  const system = `
    You are an in-app support agent. The user is stuck.
    CURRENT UI STATE: ${JSON.stringify(uiContext)}
    KNOWLEDGE BASE: ${kb}
    Reply in 1–2 sentences with the exact next action to unstick them.
  `;

  return streamText({ model: openai('gpt-4o-mini'), system, messages })
    .toDataStreamResponse();
}
```

> ⚠️ Next.js 16 may have moved/renamed APIs. Before writing the actual route,
> consult `node_modules/next/dist/docs/` (see `AGENTS.md`). The snippet above
> is illustrative, not copy-paste-ready.

## Knowledge Base — the hackathon shortcut

**Do NOT build a vector DB / embeddings / RAG pipeline.** Embedding + indexing + retrieval
debugging burns time you don't have.

Instead, exploit the 128k context window:

1. Drop 3–5 markdown files in `knowledge-base/`:
   - `form-rules.md` — business rules / validation expectations
   - `routing-map.md` — what URLs / screens mean what
   - `troubleshooting.md` — fixes for known stuck states
2. `fs.readFileSync` them in the route handler.
3. String-concatenate them into the system prompt.

That's it. It looks like a complex RAG system; it's `cat`.

## Why this wins

- **Time-to-first-API-call:** ~15 minutes.
- **Wow factor:** the `uiContext` payload. User asks "why can't I submit?", and the
  agent already names the broken field — without the user describing it.
- **Faked complexity:** KB injection looks like RAG. It isn't. The judges won't peek.

## Execution Plan

1. ✅ Scaffold backend (Next.js + TS + Tailwind + AI SDK) — **done**
2. ⬜ Add `OPENAI_API_KEY` to `.env.local`
3. ⬜ Write `src/app/api/chat/route.ts` (consult Next.js 16 docs first)
4. ⬜ Configure CORS for the Vite dev origin
5. ⬜ Populate `knowledge-base/*.md` with real rules from the client app's domain
6. ⬜ Add `<AgentWidget />` to the client SPA, scrape UI context, point at this backend
7. ⬜ Deploy backend to Vercel; update client to call the prod URL

## Open Questions

- Which client app is this targeting? (Determines KB content + uiContext shape.)
- Which form library does the client use? (Determines how to scrape errors from the DOM/state.)
- Are we OK shipping `OPENAI_API_KEY` usage to Vercel as-is, or do we need a rate limit / auth?
