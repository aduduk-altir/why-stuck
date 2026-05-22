import { z } from 'zod';

/**
 * Single source of truth for the /api/chat request contract.
 * The chip1 client must derive its types and runtime validation from these schemas —
 * see docs/api-contract.md for the full client-side guidance.
 */

/**
 * UiContext — what the widget scrapes from the host page before each turn.
 * passthrough() so the client can add ad-hoc keys without a server-side schema bump.
 */
export const UiContextSchema = z
  .object({
    url: z.string().optional(),
    pathname: z.string().optional(),
    formState: z.unknown().optional(),
    errors: z.unknown().optional(),
    visibleText: z.string().optional(),
  })
  .passthrough();

export type UiContext = z.infer<typeof UiContextSchema>;

/**
 * UIMessage from AI SDK v6 — `parts` array, not flat `content`.
 * We accept it loosely on the wire and re-validate via convertToModelMessages downstream.
 */
const UIMessagePartSchema = z
  .object({
    type: z.string(),
  })
  .passthrough();

const UIMessageSchema = z.object({
  id: z.string().optional(),
  role: z.enum(['system', 'user', 'assistant']),
  parts: z.array(UIMessagePartSchema),
});

export const ChatRequestSchema = z.object({
  messages: z.array(UIMessageSchema).min(1),
  uiContext: UiContextSchema.optional(),
});

export type ChatRequest = z.infer<typeof ChatRequestSchema>;
