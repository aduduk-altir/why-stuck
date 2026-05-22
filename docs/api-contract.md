# `/api/chat` — API Contract

This file is the **source of truth** for the request/response contract between the
chip1-webui widget and this backend.

> **Rule for chip1-webui subagents:** When you build or modify the `AgentWidget` (or any
> client-side code that talks to this backend), you must derive your request body type
> from this file. Either copy `src/lib/schemas.ts` from whyStuck verbatim, or — if chip1
> can't take a `zod` dependency — mirror the shapes in this doc as TypeScript types only.
> Do not invent a parallel type definition that can drift. If the contract changes, it
> changes here first; the client follows.
>
> **Sharing this doc to the client is the canonical sync path:** copy `docs/api-contract.md`
> into chip1-webui (or read it side-by-side) when working on the widget — it's the
> human-readable source of truth that travels with the team. The zod schema is the
> machine-readable source of truth and lives only on the server.
>
> **Runtime validation asymmetry (current state):** the server validates every request
> with `ChatRequestSchema.safeParse` and returns `400` on drift. The chip1 client has no
> `zod` dependency (CLAUDE.md there forbids new packages), so it mirrors the contract as
> TS types only — no client-side `parse()` before sending. Drift gets caught on the wire,
> not in the IDE. If you ever add `zod` to chip1, also wire a `UiContextSchema.parse()`
> call into `scrapeUiContext()` to catch drift before the wire.

## Endpoint

- **URL (dev):** `http://localhost:3000/api/chat` (this Next.js app)
- **URL (prod):** `https://why-stuck.vercel.app/api/chat`
- **Method:** `POST`
- **Content-Type:** `application/json`
- **CORS:** allowlist is `http://localhost:3020` + `*.chip1.info`. Other origins get `403`.

## Request body

Defined by `ChatRequestSchema` in `src/lib/schemas.ts`. Shape:

```ts
{
  messages: UIMessage[];           // AI SDK v6 UIMessage (parts-based, not content-based)
  uiContext?: UiContext;           // optional snapshot of the host page
}
```

### `messages`

`UIMessage[]` from the AI SDK v6. The client should obtain these from the `useChat` hook
in `@ai-sdk/react` — do not hand-roll them. Each message has `{ id, role, parts: [...] }`
where parts are typed (`text`, `file`, `tool-*`, etc.). The server re-converts to model
messages via `convertToModelMessages` before sending to OpenAI.

### `uiContext`

`passthrough()` zod object — the server preserves unknown keys and JSON-stringifies the
whole thing into the system prompt. Recommended fields (all optional):

| Field            | Type            | Example                                                                |
| ---------------- | --------------- | ---------------------------------------------------------------------- |
| `url`            | `string`        | `"https://crm.chip1.info/customers/123/edit"`                          |
| `pathname`       | `string`        | `"/customers/123/edit"`                                                |
| `formState`      | `unknown`       | `{ name: "Acme", email: "" }` (e.g. `formikBag.values`)                |
| `errors`         | `unknown`       | `{ email: "Required" }` (e.g. `formikBag.errors`)                      |
| `visibleText`    | `string`        | Snippet of visible toast / banner / error-modal text                   |
| `actionHistory`  | `UiAction[]`    | Last ≤20 user actions in chronological order (see below)               |
| `openModal`      | `string\|null`  | Name/title of the currently open modal, or `null`                      |
| `activeStep`     | `ActiveStep\|null` | Current step in a wizard, e.g. `{ name: "Review", index: 2, total: 4 }` |
| `visibleButtons` | `VisibleButton[]` | Buttons visible in the active focus region — label + context + disabled state. See below. |
| `pageTitles`     | `PageTitles`    | Heading-level text on the page (document title, H1, breadcrumbs, active tab). NOT body or table content. See below. |
| `forms`          | `VisibleForm[]` | All forms currently mounted on the page — see below                    |
| `trigger`        | `"user" \| "rage-click" \| "error-toast"` | How this turn was initiated. Omit (or send `"user"`) for normal typed/spoken requests. Set to `"rage-click"` when the widget auto-opens after detecting a stuck state. |
| `triggerTarget`  | `string`        | Human-readable label of what the proactive trigger fired on — e.g. the button text that was rage-clicked. Only meaningful when `trigger !== "user"`. |
| `triggerButton`  | `VisibleButton` | Rich descriptor of the button that fired the proactive trigger — `{ label, context, disabled }`. Strictly richer than `triggerTarget`; send both for safety. |

The widget can add any extra keys it wants (`route`, `userId`, `featureFlags`, …) — the
server just inlines them into the prompt. Treat this as "stuff the model should see," not
a typed API.

### Proactive triggers — what the server does

When `uiContext.trigger` is anything other than `"user"`, the server prepends a block to
the system prompt instructing the model to skip greetings and lead with the diagnosis in
the first sentence. The client is expected to have:

1. Detected the stuck state (e.g. ≥3 clicks on the same disabled button within ~1.5s).
2. Opened the chat panel programmatically.
3. Sent a synthesized first user message (text is irrelevant — the model is told to ignore
   it). Recommended placeholder: `"What's blocking me on this page right now?"`.
4. Set both `triggerTarget` (label) and `triggerButton` (`{ label, context, disabled }`) so
   the server can describe the click site to the model. When `triggerButton.disabled` is
   true, the system prompt explicitly tells the model to explain *why* the button is disabled.

The widget should keep `trigger` set to `"user"` (or omit it) on every subsequent turn in
the same conversation — the proactive instruction only applies to the opening reply.

### `UiAction`

```ts
type UiAction = {
  type: 'navigate' | 'click' | 'submit' | 'modal-open' | 'modal-close';
  target: string;     // button label, route name, modal title, form name
  timestamp: number;  // Date.now()
};
```

**Hard rules for action history:**

- **No PII.** Record that a form was submitted, never the values. Live field values still
  flow through `formState`.
- **Cap at 20 entries.** Prompt token budget matters and older actions decay fast.
- **Chronological order** (oldest first, newest last) so the model reads it as a story.

### `ActiveStep`

```ts
type ActiveStep = {
  name: string;            // human-readable step name, e.g. "PO Arrival Check — Review"
  index?: number;          // zero-based
  total?: number;          // total steps in the wizard
};
```

### `VisibleForm`

```ts
type VisibleForm = {
  name: string;             // stable id — matches what a `submit` UiAction records in `target`
  label?: string;           // human-readable form title (modal title, section heading, fieldset legend)
  fieldGroups?: string[];   // names of field groups / fieldset legends / wizard step labels within the form
};
```

### `VisibleButton`

```ts
type VisibleButton = {
  label: string;            // accessible name of the button (text content or aria-label)
  context: string;          // where this button is rendered — see preferred values below
  disabled?: boolean;       // true if the button is non-interactive (aria-disabled or disabled attr)
};
```

The bare label is rarely enough — "Save" appears in panel toolbars, modal footers, and stepper footers, with very different unstick instructions for each. `context` resolves that. **Preferred values:**

| `context`                | Where the button lives                                                                |
| ------------------------ | ------------------------------------------------------------------------------------- |
| `"fab"`                  | The floating round button itself (bottom-right of detail pages)                       |
| `"fab-menu"`             | An item inside the FAB popover menu                                                   |
| `"tabs"`                 | A tab in the page's tab strip                                                         |
| `"header"`               | Page header / hero area (rare — most pages don't have header actions)                 |
| `"table-toolbar"`        | Buttons above a table (e.g. "Add Row")                                                |
| `"table-footer"`         | Buttons under a table (pagination, totals)                                            |
| `"table-row"`            | Inline action on a single row                                                         |
| `"row-menu"`             | Right-click context menu on a row                                                     |
| `"selection-action-bar"` | Bar that appears at the bottom of a table when rows are selected                      |
| `"modal-footer"`         | Confirm/Cancel inside an open modal                                                   |
| `"stepper-footer"`       | Next/Back inside a multi-step wizard                                                  |
| `"inline"`               | Anywhere else inline in the page body                                                 |

The schema accepts any string, so the client may introduce new values. **Document any new value in this table** before shipping it — drift gets caught at code-review time, not runtime.

### `PageTitles`

```ts
type PageTitles = {
  document?: string;       // document.title (browser tab text)
  h1?: string;             // primary H1 in the main region (e.g. "RFQ #12345")
  breadcrumbs?: string[];  // breadcrumb trail, root → current (e.g. ["Sales", "RFQs", "RFQ #12345"])
  activeTab?: string;      // label of the currently active tab (e.g. "Sourcing Analysis")
};
```

This is intentionally narrow: **only heading-level text**, never body content or table rows. Goal is to give the model the page-identity signal it would otherwise have to infer from `pathname` alone, while keeping the prompt tight and free of PII.

Used when **multiple forms can be mounted at once** — e.g. a Customer Edit modal opened over a Sales Order page. `formState` and `errors` remain a snapshot of the *focused* form, but `forms[]` enumerates every form on the page so the agent can disambiguate ("the email error is on the Customer modal, not the Sales Order form behind it"). The `name` field must match the `target` of a `submit` action so the model can correlate a submit event with the form definition.

## Example request

```http
POST /api/chat HTTP/1.1
Host: localhost:3000
Origin: http://localhost:3020
Content-Type: application/json

{
  "messages": [
    {
      "id": "m1",
      "role": "user",
      "parts": [{ "type": "text", "text": "Why can't I submit?" }]
    }
  ],
  "uiContext": {
    "url": "http://localhost:3020/customers/123/edit",
    "pathname": "/customers/123/edit",
    "formState": { "name": "Acme", "email": "" },
    "errors": { "email": "Email is required" },
    "openModal": "Customer Edit",
    "activeStep": null,
    "visibleButtons": [
      { "label": "Save",   "context": "modal-footer", "disabled": true },
      { "label": "Cancel", "context": "modal-footer" },
      { "label": "Delete", "context": "modal-footer" }
    ],
    "pageTitles": {
      "document": "Edit Customer — Acme | Chip1 CRM",
      "h1": "Acme",
      "breadcrumbs": ["Customers", "Acme", "Edit"],
      "activeTab": "General"
    },
    "actionHistory": [
      { "type": "navigate", "target": "/customers/123", "timestamp": 1747900000000 },
      { "type": "click", "target": "Edit", "timestamp": 1747900005000 },
      { "type": "modal-open", "target": "Customer Edit", "timestamp": 1747900005100 },
      { "type": "click", "target": "Save", "timestamp": 1747900030000 }
    ],
    "trigger": "rage-click",
    "triggerTarget": "Save",
    "triggerButton": { "label": "Save", "context": "modal-footer", "disabled": true }
  }
}
```

## Response

Streaming UI Message Stream from AI SDK v6 (`result.toUIMessageStreamResponse()`).
The client must consume it with `useChat` from `@ai-sdk/react` — do not parse it by hand.

## Error responses (non-stream)

| Status | When                                            | Body                                                       |
| ------ | ----------------------------------------------- | ---------------------------------------------------------- |
| `400`  | JSON parse failure                              | `{ "error": "Invalid JSON body" }`                         |
| `400`  | Zod validation failure                          | `{ "error": "Invalid request", "issues": ZodIssue[] }`     |
| `403`  | Origin not on the CORS allowlist                | `{ "error": "Origin not allowed" }`                        |

## Client wiring (AI SDK v6 + DefaultChatTransport)

```ts
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';

const { messages, sendMessage, status } = useChat({
  transport: new DefaultChatTransport({
    api: import.meta.env.VITE_AGENT_API_URL,  // points at this backend
    body: () => ({
      uiContext: scrapeUiContext(),           // recomputed per request
    }),
  }),
});
```

`scrapeUiContext()` on the client should return an object matching `UiContextSchema`. Use
the schema (copied into chip1) to `parse()` the scraped object before sending — that
catches drift before it ever hits the wire.

## Changing the contract

1. Edit `src/lib/schemas.ts` here.
2. Update this file.
3. Apply the same schema change in chip1-webui (`apps/crm/src/features/AgentWidget/`).
4. Append a `timeline.md` entry on **both** sides describing the contract change.
