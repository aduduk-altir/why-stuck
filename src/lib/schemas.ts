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
  /**
   * The form's own submit button (resolved by walking the `<form>` for a
   * `[type="submit"]` descendant). Populated here even when the button is
   * missed by `visibleButtons[]` (e.g. portaled outside the form's DOM scope,
   * unusual selector). Treat this as the truthful disabled-state signal for
   * "can this form be submitted right now".
   */
  submit: z
    .object({
      label: z.string(),
      disabled: z.boolean().optional(),
    })
    .optional(),
});

export type VisibleForm = z.infer<typeof VisibleFormSchema>;

/**
 * One actionable button visible on the page. The `context` tag tells the agent
 * *where* the button lives — a disabled "Update Status" on the FAB is a very
 * different signal from a disabled "Save" in a modal footer. Preferred values
 * for `context`:
 *   - "fab"                   the floating round button itself
 *   - "fab-menu"              an item inside the FAB popover menu
 *   - "tabs"                  a tab in the tab strip
 *   - "header"                page header / hero area
 *   - "table-toolbar"         buttons above a table (e.g. "Add Row")
 *   - "table-footer"          buttons under a table (pagination, totals)
 *   - "table-row"             inline action on a row
 *   - "row-menu"              right-click context menu on a row
 *   - "selection-action-bar"  bar that appears when rows are selected
 *   - "modal-footer"          confirm/cancel inside an open modal
 *   - "stepper-footer"        next/back inside a multi-step wizard
 *   - "inline"                anywhere else inline in the body
 * Free-form string so the client can introduce new contexts without a server
 * bump; document any new value in docs/api-contract.md.
 */
export const VisibleButtonSchema = z.object({
  label: z.string(),
  context: z.string(),
  disabled: z.boolean().optional(),
});

export type VisibleButton = z.infer<typeof VisibleButtonSchema>;

/**
 * Heading-level text on the current page. Intentionally narrow: document title,
 * primary H1, breadcrumb trail, and active tab label. Does NOT include arbitrary
 * body text or table contents — that would balloon the prompt and leak PII.
 */
export const PageTitlesSchema = z.object({
  document: z.string().optional(),
  h1: z.string().optional(),
  breadcrumbs: z.array(z.string()).optional(),
  activeTab: z.string().optional(),
});

export type PageTitles = z.infer<typeof PageTitlesSchema>;

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
    visibleButtons: z.array(VisibleButtonSchema).optional(),
    pageTitles: PageTitlesSchema.optional(),
    forms: z.array(VisibleFormSchema).optional(),
    /**
     * How this turn was initiated. `"user"` (or omitted) = the user typed/spoke.
     * `"rage-click"` / `"error-toast"` = the widget detected a stuck state and
     * synthesized the request. When non-"user", the server prompts the model to
     * lead with the diagnosis instead of greeting.
     */
    trigger: z.enum(['user', 'rage-click', 'error-toast']).optional(),
    /**
     * Human-readable identifier of what the proactive trigger fired on — e.g. the
     * button label that was rage-clicked, or the toast text that appeared.
     */
    triggerTarget: z.string().optional(),
    /**
     * Rich descriptor of the button that triggered a proactive open (rage-click).
     * The bare `triggerTarget` label is ambiguous when the same label appears in
     * multiple contexts (e.g. a disabled "Save" in a modal vs. an enabled "Save"
     * in a panel). `triggerButton` carries the full `{ label, context, disabled }`
     * so the agent can reason about *why* the click failed without scanning
     * `visibleButtons` for a label match.
     */
    triggerButton: VisibleButtonSchema.optional(),
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
