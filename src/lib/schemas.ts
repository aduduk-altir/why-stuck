import { z } from 'zod';

/**
 * Single source of truth for the /api/chat request contract.
 * The chip1 client must derive its types and runtime validation from these schemas —
 * see docs/api-contract.md for the full client-side guidance.
 */

/**
 * One entry in the user's recent action history. The client maintains a ring buffer
 * (cap 20) and ships it on every turn so the agent can reason about the *journey*
 * that led to the current state — not just the snapshot. No PII: capture that a form
 * was submitted, never the values (live values still flow via `formState`).
 */
export const UiActionSchema = z.object({
  type: z.enum(['navigate', 'click', 'submit', 'modal-open', 'modal-close']),
  target: z.string(),
  timestamp: z.number(),
});

export type UiAction = z.infer<typeof UiActionSchema>;

/**
 * Where the user is inside a multi-step wizard, when one is active.
 */
export const ActiveStepSchema = z.object({
  name: z.string(),
  index: z.number().int().nonnegative().optional(),
  total: z.number().int().positive().optional(),
});

export type ActiveStep = z.infer<typeof ActiveStepSchema>;

/**
 * One mounted form on the current page. Multiple forms can be open at once
 * (e.g. a customer-edit modal over a sales-order page), so the agent needs to
 * know *which* form a submit/error/formState relates to. `name` should match
 * what a `submit` action records in `actionHistory` so the model can correlate.
 */
export const VisibleFormSchema = z.object({
  name: z.string(),
  label: z.string().optional(),
  fieldGroups: z.array(z.string()).optional(),
});

export type VisibleForm = z.infer<typeof VisibleFormSchema>;

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
    actionHistory: z.array(UiActionSchema).max(20).optional(),
    openModal: z.string().nullable().optional(),
    activeStep: ActiveStepSchema.nullable().optional(),
    visibleButtons: z.array(z.string()).optional(),
    forms: z.array(VisibleFormSchema).optional(),
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
