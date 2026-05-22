# `/api/chat` — API Contract

This file is the **source of truth** for the request/response contract between the
chip1-webui widget and this backend.

> **Rule for chip1-webui subagents:** When you build or modify the `AgentWidget` (or any
> client-side code that talks to this backend), you must derive your request body type
> and runtime validation from the zod schemas defined in `src/lib/schemas.ts` of this
> repo (whyStuck). Either copy the schema file into chip1-webui or reproduce it verbatim
> — but do not invent a parallel type definition that can drift. If the contract changes,
> it changes here first; the client follows.

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

| Field         | Type      | Example                                                                |
| ------------- | --------- | ---------------------------------------------------------------------- |
| `url`         | `string`  | `"https://crm.chip1.info/customers/123/edit"`                          |
| `pathname`    | `string`  | `"/customers/123/edit"`                                                |
| `formState`   | `unknown` | `{ name: "Acme", email: "" }` (e.g. `formikBag.values`)                |
| `errors`      | `unknown` | `{ email: "Required" }` (e.g. `formikBag.errors`)                      |
| `visibleText` | `string`  | Snippet of visible toast / banner / error-modal text                   |

The widget can add any extra keys it wants (`route`, `userId`, `featureFlags`, …) — the
server just inlines them into the prompt. Treat this as "stuff the model should see," not
a typed API.

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
    "errors": { "email": "Email is required" }
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
