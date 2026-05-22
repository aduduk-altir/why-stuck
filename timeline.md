# whyStuck — Hackathon Timeline

Chronological log of actions taken during the hackathon. Short entries only — one line per
notable action. Newest at the bottom. Used as the demo cheat-sheet for "what we built and
in what order".

> Convention: append a one-line bullet. Group under a date heading. No paragraphs.

## 2026-05-22

- Bootstrapped repo: `pnpm create next-app` → Next.js 16 + TypeScript + Tailwind v4 + App Router + `src/` + ESLint.
- Installed Vercel AI SDK + OpenAI provider (`ai`, `@ai-sdk/openai`).
- Seeded `knowledge-base/rules.md` placeholder for the system-prompt KB injection pattern.
- Added editor/git config: `.editorconfig`, `.gitattributes`, `.prettierignore`, extended `.gitignore` (IDE, claude, ralphex, turbo).
- `git init` on `main` + initial commit (`7963c66`).
- Captured the architecture plan in `docs/architecture.md` (two-repo split, KB-as-markdown, execution checklist).
- Restructured `CLAUDE.md` after chip1-webui pattern — slim file + conditional-reading table linking to `docs/`.
- Added project-level `/brainstorm` skill in `.claude/skills/brainstorm/` to load all docs and switch into exploratory mode.
- Started `timeline.md` (this file) as the running demo cheat-sheet.
