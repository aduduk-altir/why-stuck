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
- Researched chip1-webui CRM codebase and wrote 3 KB files: `routing-map.md` (60+ URL patterns), `form-rules.md` (all form fields + validation rules), `troubleshooting.md` (stuck-state resolution guide).
- Replaced `rules.md` stub with `00-index.md` — agent overview + KB table of contents, loads first in the system prompt.
- Client: push-to-talk voice input added to AgentWidget — Web Speech API hook (`useSpeechToText`), interim transcripts fill the input live, no auto-send (user edits before sending), Chrome-only (demo browser). chip1-webui commit `d54717f`.
- Contract bump: `UiContextSchema` gained `actionHistory` (ring buffer cap 20: navigate/click/submit/modal-open/close with timestamps), `openModal`, `activeStep`, `visibleButtons` — all optional, additive. Turns the snapshot into a journey so the agent can say "you opened X then clicked Save…" not just "the email field is empty". `docs/api-contract.md` updated, schema-first.
- Client: chip1-webui commit `84561a0e3` — `ActionHistoryProvider` mounted above the router installs capture-phase click/submit listeners + history-API patch; modal events bridged from `ModalsProvider` via a `createEventEmitter` side-channel (widget mounts outside the modal provider tree, so a hook wasn't viable); MUI `Stepper` DOM-scrape covers PO Arrival Check + any other MUI-Stepper wizard. Note: chip1 has no `zod` dep, so client mirrors the contract as TS types only — runtime validation still happens server-side via passthrough. Browser smoke test pending.
- Contract bump #2: `UiContextSchema` gained `forms[]` (`VisibleForm = { name, label?, fieldGroups? }`) so the agent can disambiguate when multiple forms are mounted (e.g. Customer Edit modal over a Sales Order page). `name` aligns with `submit` action `target` so the model can correlate.
- Client: chip1-webui commit `4fca3e6f9` — `scrapeForms()` enumerates every mounted `<form>` with label + field-group names (fieldsets, role="group", section headings, active stepper label); shared `resolveFormName` helper with a `WeakMap` index guarantees submit-capture and forms[] resolve identical names for nameless forms.
- CORS: loosened the chip1 host pattern to allow nested subdomains so `https://crm-stage-why-stuck.stage.chip1.info` (and any future `*.*.chip1.info`) gets through. Previous regex only matched single-segment subdomains.
