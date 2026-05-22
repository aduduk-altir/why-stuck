# whyStuck — Hackathon Timeline

Chronological log of actions taken during the hackathon. Short entries only — one line per
notable action. Newest at the bottom. Used as the demo cheat-sheet for "what we built and
in what order".

> Convention: append a one-line bullet. Group under a date heading. No paragraphs.

## 2026-05-22

- Brainstormed the concept with ChatGPT + Gemini — settled on an in-app "I'm stuck" agent that scrapes UI context (URL + form state + errors) and answers from a markdown KB.
- Pressure-tested the architecture options with ChatGPT/Gemini — picked the two-repo split (client widget in chip1-webui, Next.js backend here) over a monorepo or single-repo bot.
- Switched to Claude Code to actually implement.
- Bootstrapped repo: `pnpm create next-app` → Next.js 16 + TypeScript + Tailwind v4 + App Router + `src/` + ESLint.
- Installed Vercel AI SDK + OpenAI provider (`ai`, `@ai-sdk/openai`).
- Seeded `knowledge-base/rules.md` placeholder for the system-prompt KB injection pattern.
- Added editor/git config: `.editorconfig`, `.gitattributes`, `.prettierignore`, extended `.gitignore` (IDE, claude, ralphex, turbo).
- `git init` on `main` + initial commit (`7963c66`).
- Captured the architecture plan in `docs/architecture.md` (two-repo split, KB-as-markdown, execution checklist).
- Restructured `CLAUDE.md` after chip1-webui pattern — slim file + conditional-reading table linking to `docs/`.
- Added project-level `/brainstorm` skill in `.claude/skills/brainstorm/` to load all docs and switch into exploratory mode.
- Started `timeline.md` (this file) as the running demo cheat-sheet.
- Documented the client repo coordinates (`../chip1-webui`, branch `feat/hackathon-why-stuck`, widget under `apps/crm/src/features/AgentWidget/`) and the subagent rule for working in that repo.
- Installed `zod` and built the first `/api/chat` route: zod-validated body (`ChatRequestSchema`), per-request KB read, CORS allowlist for `localhost:3020` + `*.chip1.info`, streaming via AI SDK v6 `toUIMessageStreamResponse`.
- Added `src/lib/env.ts` (zod-validated `process.env`), `src/lib/schemas.ts` (UiContext + ChatRequest), `src/lib/cors.ts` (origin matcher + preflight), and `.env.example`.
- Wrote `docs/api-contract.md` as the single source of truth for the client/server contract — chip1-webui subagents must derive types from these schemas.
- Pushed to GitHub (`git@github.com:aduduk-altir/why-stuck.git`, `main`) and deployed to Vercel at `https://why-stuck.vercel.app/` with `OPENAI_API_KEY` set in project env vars. Backend live.
