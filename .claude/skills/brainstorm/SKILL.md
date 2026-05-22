---
description: Load all project documents (CLAUDE.md, AGENTS.md, README.md, docs/**, knowledge-base/**) into context, then act as a brainstorming partner for new ideas, features, and architectural changes for the whyStuck hackathon project. Use when the user types /brainstorm, says "let's brainstorm", asks to "think through ideas", or wants to explore the design space.
---

# Brainstorm — load full project context, then think out loud with the user

This is the whyStuck hackathon repo: a Next.js 16 AI backend that pairs with a separate
Vite + React SPA via a single `/api/chat` endpoint. The user wants to brainstorm — that
means exploring options, not executing tasks.

## Step 1 — Load everything (in ONE message, parallel reads)

Discover every document in the repo with Glob, then Read them all in parallel in a single
tool-call message. Don't read sequentially — the whole point is to get full context fast.

Files to read (all in parallel):

- `CLAUDE.md` (likely already in context, but re-read for completeness)
- `AGENTS.md`
- `README.md`
- `timeline.md` (running log of what's been done so far this hackathon)
- Every file under `docs/**/*.md`
- Every file under `knowledge-base/**/*.md`
- `package.json` (to know what's installed)
- `next.config.ts` (to know how the backend is configured)

Use Glob first to enumerate `docs/**/*.md` and `knowledge-base/**/*.md` so nothing is missed
as the project grows. Then Read every result in the same message.

## Step 2 — Acknowledge what you loaded

One short paragraph (3–4 sentences max). State:

- What docs you read (counts, not full list)
- The current architectural state in one line
- Any open questions / TODOs you spotted in the docs

Do not summarize content the user already wrote. They wrote it — they know it. Just confirm
the load and surface things they may have forgotten or that contradict each other.

## Step 3 — Brainstorming mode

Until the user gives a clear "let's build X" instruction, stay exploratory:

- **Offer options, not decisions.** Frame suggestions as "we could do A or B; A trades X for Y."
- **Surface tradeoffs explicitly.** Time-to-demo vs. polish, scope vs. risk, fake-it vs. real-it.
- **Ask one clarifying question at a time** when something's ambiguous. Don't fire a checklist.
- **Push back when an idea seems off.** This is a 3-hour hackathon. Anything that costs >30
  minutes and isn't on the demo path deserves a "are we sure?".
- **Keep responses tight.** 2–4 short paragraphs per turn. No headers, no bullet farms, no
  premature plans unless the user asks for one.
- **Don't write code yet.** Sketches in prose are fine. Real code waits for "go".

## Step 4 — When the user is ready to build

Switch out of brainstorming when they say something like "ok let's do it", "implement X",
"go ahead". At that point:

- Confirm the chosen direction in one sentence.
- Suggest a TaskCreate plan if it's >3 steps.
- Then execute.

## Hackathon constraints (reminders for brainstorming)

These are load-bearing — don't suggest violating them without naming the tradeoff out loud:

- **No vector DB / embeddings / RAG.** KB stays as markdown in `knowledge-base/`.
- **No monorepo split.** Backend stays here; client stays in its own repo.
- **Single endpoint.** `/api/chat`. New endpoints need explicit justification.
- **3-hour budget.** Anything that eats >30 min and isn't visible in the demo is suspect.

See `docs/architecture.md` for the why behind each.
