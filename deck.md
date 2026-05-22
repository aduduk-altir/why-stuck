---
marp: true
theme: default
paginate: true
size: 16:9
backgroundColor: #fff
---

# whyStuck
## An in-app "I'm stuck" agent

Altir hackathon · 2026-05-22

*The chatbot that already knows what you're looking at.*

---

## The problem

Users get stuck inside complex flows. A few common shapes:

- A form won't submit and the error is hidden in a collapsed section
- The required field lives on a different tab than the user is on
- A section is silently locked because the parent record is in the wrong status
- They rage-click a disabled button and assume the app is broken

Traditional in-app chat asks: *"describe your problem."*

We flip it: **the agent already has the problem in hand before the user types.**

---

## What we built

A floating widget inside chip1 CRM that, on every turn:

1. Scrapes the current UI into a structured `uiContext` payload
2. POSTs it (plus the conversation) to an AI backend
3. Streams back an answer that names the broken field, the locked section, the right tab

Two repos, talking over HTTP — deliberately not a monorepo:

- **Client:** `chip1-webui` → widget under `apps/crm/src/features/AgentWidget/`
- **Backend:** `why-stuck` (this repo) → Next.js 16 + Vercel AI SDK v6 + OpenAI

---

## Architecture

```
┌────────────────────────────────────────┐         ┌───────────────────────────────┐
│  HOST APP                              │         │  why-stuck.vercel.app         │
│  today:    chip1-webui CRM             │         │  /api/chat                    │
│  tomorrow: any React app               │         │                               │
│                                        │         │                               │
│   ┌────────────────────────────────┐   │ ─POST──>│   - uiContext → prompt        │
│   │ @altir/why-stuck-widget (SDK)  │   │         │   - KB injection              │
│   │ today:    vendored             │   │ <stream─│   - streamText (gpt-4.1-mini) │
│   │ tomorrow: `pnpm add` it        │   │         │   - knowledge-base/*.md       │
│   │                                │   │         │                               │
│   │ - scrapeUiContext()            │   │         │                               │
│   │ - useChat() transport          │   │         │                               │
│   │ - rage-click detector          │   │         │                               │
│   │ - push-to-talk                 │   │         │                               │
│   └────────────────────────────────┘   │         │                               │
└────────────────────────────────────────┘         └───────────────────────────────┘
```

**Widget is its own SDK** — vendored today, `pnpm add @altir/why-stuck-widget` tomorrow. Backend is host-agnostic. **No vector DB, no RAG** — KB is markdown in the system prompt.

---

## The `uiContext` payload — where the wow comes from

The agent never asks *"what page are you on?"* The payload tells it:

| Field | What it carries |
| --- | --- |
| `url` / `pathname` | Where they are |
| `formState` / `errors` | Live Formik values + validation messages |
| `forms[]` | Every mounted form — disambiguates modal-over-page |
| `visibleButtons[]` | `{ label, context, disabled }` per button |
| `pageTitles` / `openModal` / `activeStep` | Page title + open modal + wizard step |
| `actionHistory[]` | Last 20 actions, chronological, no PII |
| `trigger` / `triggerButton` | `user` / `rage-click` / `error-toast` (+ button) |

> User: *"why can't I submit?"*
> Agent: *"The Customer Edit modal's Email field is empty — fill it before clicking Save."*

---

## Build timeline

1. **Scaffold + deploy** — Next.js 16 + AI SDK v6, `/api/chat` live on Vercel in hour one
2. **KB compressed** into 4 markdown files — routing-map, form-rules, troubleshooting, index
3. **Push-to-talk voice** — Web Speech API, interim transcripts type live
4. **Action history** — 20-step journey, capture-phase listeners, no PII
5. **Proactive rage-click trigger** — 3+ clicks open the widget mid-diagnosis
6. **Rich button context** — every button carries `{ label, context, disabled }`
7. **Sentry "Report an issue"** — one-click incident with full payload + transcript
8. **Deck shipped** — Marp-rendered, served at `/deck` on the same Vercel deploy

> Full chronology in `timeline.md` — every commit, every decision.

---

## Live demo

*[Switch to the chip1 CRM. Open a Sales Order, leave a required field blank, rage-click Save, let the widget do its thing.]*

Backup paths if anything wobbles:
- Type the same question into the widget instead of rage-clicking
- Pull up `timeline.md` and walk the build chronologically
- Hit the deployed endpoint directly with the example payload from `docs/api-contract.md`

---

## What's next — near-term

**Agentic KB retrieval.** Today every KB file lands in the system prompt. Past ~6 files that wastes tokens and latency. Plan (`docs/agentic-kb.md`): inject only the TOC, let the model fetch what it needs.

```
┌─────────────────┐    ┌─────────────────────┐    ┌──────────────────────┐
│ system prompt   │ ──>│ model picks doc(s)  │ ──>│ tool: readKbFile     │
│ + 00-index.md   │    │ via tool call       │    │ (whitelisted name)   │
│ (always loaded) │    └─────────────────────┘    └──────────────────────┘
└─────────────────┘             ^                            │
                                │                            v
                                │            ┌──────────────────────┐
                                └────────────│ file contents as     │
                                             │ tool result          │
                                             └──────────────────────┘
                                                        │
                                                        v
                                             ┌──────────────────────┐
                                             │ model answers using  │
                                             │ doc(s) it fetched    │
                                             └──────────────────────┘
```

**Demo-theater bonus:** stream the tool calls into the widget — *"Reading routing-map.md…"* — making the agent's "thinking" visible.

---

## What's next — the KB builds itself

Today the KB is hand-curated: we read CRM source and compressed it into 4 markdown files. **That doesn't scale past one host app.**

Wire a GitHub integration: connect a repo, webhook on push, the agent fetches the diff, runs analysis queries against the new code, rewrites the relevant KB files. No human in the loop.

```
┌──────────────┐   push hook   ┌──────────────────────┐
│  GitHub repo │ ─────────────>│  why-stuck backend   │
│  (host app)  │               │   - fetch changes    │
└──────────────┘               │   - LLM analyzes     │
                               │   - regenerate KB    │
                               └──────────┬───────────┘
                                          v
                               ┌──────────────────────┐
                               │  knowledge-base/*.md │
                               │  (auto-refreshed)    │
                               └──────────────────────┘
```

The hackathon shortcut (KB by hand) becomes the production pattern (KB by agent) — same architecture downstream, the agent never knows the difference.

---

## What's next — the fantasy version

**Claude running on the backend, inside an actual clone of the client repo.**

Today the KB is a hand-curated snapshot. Tomorrow:

- The agent has a working git clone of `chip1-webui`
- It can `grep`, `read`, `git log` against real source
- *"Why is this button disabled?"* → it reads the component
- *"Why does this validation fire?"* → it reads the Yup schema
- It can open a draft ticket, propose a one-line PR, or surface the offending commit

The 3-hour KB-as-markdown trick gets us to a working demo today.
**The real moat is the agent loop with real code in front of it.**

---

## Constraints we held the line on

- ✗ No vector DB / embeddings / RAG framework
- ✗ No monorepo split — client and backend deploy independently
- ✗ No new endpoints — just `/api/chat`
- ✗ No auth, no DB, no queue (yet)
- ✓ Budget: 3 hours from blank repo to a deployed demo

Every decision is traceable in `timeline.md` — the running build log.

---

## Thanks

- **Backend repo:** `github.com/aduduk-altir/why-stuck`
- **Live endpoint:** `https://why-stuck.vercel.app/api/chat`
- **Client widget:** `chip1-webui`, branch `feat/hackathon-why-stuck`
- **API contract:** `docs/api-contract.md` — the source of truth between the two repos

Questions?
