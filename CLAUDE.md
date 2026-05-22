# CLAUDE.md

Guidance for Claude Code (claude.ai/code) when working in this repository.

@AGENTS.md

## What this repo is

**whyStuck** — the AI backend for a hackathon "I'm stuck" in-app agent. A Next.js 16 app
exposing a single `/api/chat` endpoint that a separate Vite + React SPA calls to get
context-aware help. See `docs/architecture.md` for the full plan, the why-not-monorepo
reasoning, and the execution checklist.

**Time budget:** 3-hour hackathon. Optimize for time-to-demo. Skip abstractions, skip
RAG/vector DBs, skip anything that takes more than 5 minutes to debug.

## Maintaining This File

- **Universal behavioral rules only** belong here — things that produce silent bugs if missed on any task.
- **Everything else goes in `docs/`** as a separate reference file, with a trigger added to the table below.
- **Never inline detailed patterns, long code blocks, or architecture explanations here** — link to `docs/<topic>.md` instead.

## Conditional Reading — Load Before Starting

| Trigger                                                                                | File                     |
| -------------------------------------------------------------------------------------- | ------------------------ |
| Anything that involves the system design, the client/server split, or the KB approach | `docs/architecture.md`   |
| Writing or modifying Next.js route handlers, layouts, configs, or anything in `src/app/` | `node_modules/next/dist/docs/` (Next.js 16 is newer than your training data — verify APIs) |

---

## Windows Shell — Bash Path Convention

When using the **Bash tool** on this machine, always write absolute paths with **forward slashes**: `D:/projects/altir/whyStuck/...`

- ❌ `cd D:\projects\altir\whyStuck` — backslashes are eaten by bash as escape characters
- ✅ `cd D:/projects/altir/whyStuck` — forward slashes work in Git Bash on Windows

Applies to every `cd`, command argument, or path string passed to the Bash tool.

---

## Hackathon Constraints

- **Do not introduce a vector DB, embeddings pipeline, or RAG framework.** The KB is markdown files in `knowledge-base/` injected into the system prompt — see `docs/architecture.md`.
- **Do not split this into a monorepo.** Resisted that already; don't reopen it without explicit user direction.
- **Single endpoint only.** `/api/chat`. No auth, no DB, no queue. Add only if explicitly asked.
- **CORS is open to the Vite dev origin.** When wiring it up, also allow the eventual prod client origin.

---

## Code Style

- TypeScript everywhere. No `as any` without an inline justification comment.
- Default to writing no comments — only add one when the *why* is non-obvious.
- Prefer `node:`-prefixed imports for Node built-ins: `import fs from 'node:fs'`.
- Environment access through `process.env.OPENAI_API_KEY` etc. — never commit `.env*` (already gitignored).

---

## Before Reporting Completion

- For backend changes: `pnpm build` must succeed and `pnpm lint` must pass.
- For changes that touch the API contract with the client SPA: state in the response which client-side change is needed in the chip1 client repo. Don't assume the user will infer it.
