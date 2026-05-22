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
┌──────────────────────┐         ┌────────────────────────┐
│  chip1-webui widget  │ ──POST─▶│  why-stuck.vercel.app  │
│  - scrapes uiContext │         │  /api/chat             │
│  - useChat(transport)│ ◀stream─│  - KB injection        │
│  - push-to-talk      │         │  - streamText (gpt-4o) │
└──────────────────────┘         └────────────────────────┘
```

**No vector DB. No embeddings. No RAG framework.**
The knowledge base is markdown files in a folder, concatenated into the system prompt.

---

## The `uiContext` payload — where the wow comes from

The agent never asks *"what page are you on?"* The payload tells it:

| Field | What it carries |
| --- | --- |
| `url` / `pathname` | Where they are |
| `formState` / `errors` | Live Formik values + validation messages |
| `openModal`, `activeStep`, `visibleButtons` | What's in focus right now |
| `forms[]` | Every mounted form — disambiguates modal-over-page |
| `actionHistory[]` | Last 20 user actions as a chronological story |
| `trigger` | Typed question, rage-click, or error-toast |

> User: *"why can't I submit?"*
> Agent: *"The Customer Edit modal's Email field is empty — fill it before clicking Save."*

---

## Features shipped today

- **Markdown KB injection** — `knowledge-base/*.md` (routing-map, form-rules, troubleshooting) stuffed into the system prompt per request
- **Action history capture** — capture-phase click/submit listeners + history-API patch + modal event bridge, capped at 20 entries, no PII
- **Multi-form awareness** — `forms[]` enumerates every mounted form so the agent can say "the error is on the Customer modal, not the Sales Order behind it"
- **Push-to-talk voice input** — Web Speech API, interim transcripts type into the input live, no auto-send
- **Proactive rage-click trigger** — 3+ clicks on the same element within 1.5s opens the widget with a "Looks like you're stuck — need help?" pill
- **One-click incident report** — "Report an issue" captures to Sentry with full `uiContext` + `actionHistory` + transcript attached

---

## Live demo

*[Switch to the chip1 CRM. Open a Sales Order, leave a required field blank, rage-click Save, let the widget do its thing.]*

Backup paths if anything wobbles:
- Type the same question into the widget instead of rage-clicking
- Pull up `timeline.md` and walk the build chronologically
- Hit the deployed endpoint directly with the example payload from `docs/api-contract.md`

---

## What's next — near-term

**Agentic KB retrieval.** Today every KB file lands in the system prompt. Past ~6 files that wastes tokens and latency.

The plan (already specced in `docs/agentic-kb.md`):

- Inject only `00-index.md` — the table of contents
- Give the model a `readKbFile(name)` tool
- It picks which doc(s) to fetch, *then* answers

**Demo-theater bonus:** stream the tool calls into the widget UI — *"Reading routing-map.md…"* — making the agent's "thinking" visible. Budgeted at ~45 min when we revisit.

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
