# FAB and Page Action Buttons

This file documents **where action buttons actually live** in the CRM. The most common confusion is that users (and the agent) assume there is a header toolbar or top-right action menu. There is not — **most entity actions live on the FAB (the floating round button at the bottom-right of each detail page)**. There is also a row context menu on tables and, on list views, a selection action bar that appears when rows are selected.

When in doubt: **look at the FAB**, not the top of the page.

---

## The FAB explained

- The FAB is a **circular floating button at the bottom-right** of every detail page (RFQ, Sales Order, Sourcing Request, Purchase Order, Account, Contact, Offer, Project, Part, Stock, Shipment, Invoice, Campaign).
- Clicking it opens a **vertical popover menu of actions**. Each action either opens a modal or navigates.
- The exact list of actions changes based on:
  - **What entity / page** you are on (RFQ vs. Sales Order vs. Sourcing Request, etc.).
  - **Which tab** of the detail page you are on (e.g. some actions only appear on the Lines tab).
  - **What rows are selected** (some actions only appear when at least one row is selected).
  - **Feature flags and permissions** (a small subset of actions may be hidden for some users).
- Every detail-page FAB also includes **"Record an Activity"** and **"Create Task"** at the bottom of its menu.

There is no header toolbar with action buttons on most detail pages — the hero area shows summary cards and tabs only. The FAB is the canonical place for actions.

---

## "Update Status" — where exactly to click

This is the single most common navigation question, so it gets its own section. Every status-update flow is FAB-driven (with row-menu and selection-action-bar duplicates on lists).

### Update an RFQ's status
**RFQs do not have an entity-level status.** RFQ "status" is the status of its *lines*. To update it:

1. Open the RFQ Details page.
2. Go to the **RFQ Lines** tab.
3. **Select one or more rows** (checkbox at the start of each row).
4. Click the **FAB** (bottom-right floating round button) → choose **"Update Status"**.
5. A modal opens for the new status (and sub-status if the chosen status requires one).

Alternative click path to the same modal:
- **Selection action bar**: when rows are selected, an action bar appears at the bottom of the lines table with an "Update Status" button.
- Reachable from anywhere RFQ lines are listed: RFQ list, RFQ Lines list, Account → RFQs tab, Project → RFQs tab, Opportunities list.

Do **not** suggest right-click — see "Right-click does nothing useful" below.

### Update a single RFQ Line's status
- Open the **RFQ Line Details** page → FAB → **"Update Status"**. Always visible (no row selection needed). Sub-status appears in the modal when required.

### Update a Sales Order's status
**There is no Update Status action at the order level** — Sales Order status is derived from line statuses. To change it, update one or more order lines:
- Open the Sales Order Line Details page → FAB → **"Update Status"**.

### Update a Sourcing Request's status
- Open the **Sourcing Request Details** page → FAB → **"Update Status"**.
- For multiple SRs at once, use the bulk selection action bar on the SR list (select rows first).

### Update a Purchase Order's status
**There is no Update Status action at the PO level** — PO status is derived from PO line statuses. To change it:
- Open the **PO Line Details** page → FAB → **"Update Status"**.

### Update an Offer's status
- Open the **Offer Details** page → FAB → **"Update Status"**.

### Update a Quote's status
**There is no "Update Status" action for quotes anywhere.** Quote state changes happen implicitly when other actions are taken (e.g. when a Sales Order is created from the quote). On a Quote row you can Recommend / Unrecommend, Send, Edit, Duplicate, Create Sales Order, Attach Sales Order, or Delete — but not change a status field directly.

### Update an Account's "status"
For Accounts, the field is called **Stage**, not Status. To change it:
- Open the **Account Details** page → FAB → **"Update Stage"**.

---

## FAB actions per entity

Each list is in the order the user sees it in the popover, top to bottom. "Record an Activity" + "Create Task" are appended to every detail FAB and are omitted from the per-entity lists below for brevity.

### RFQ Details (`/sales/rfqs/:rfqId/...`)
- **Add RFQ Line** — opens the Create RFQ Line modal. Hidden on Opportunity RFQs.
- **Match Account** — only on Opportunity RFQs (an RFQ flagged `isOpportunity`); opens the account-matching modal.
- **Create a Quote(s)** — only when ≥1 RFQ lines are selected on the Lines tab.
- **Create Sourcing Request(s)** — only when ≥1 RFQ lines are selected.
- **Update Status** — only when ≥1 RFQ lines are selected (see "Update Status" section above).

### RFQ Line Details (`/sales/rfqs/:rfqId/line/:lineId/...`)
- **Generate Quote PDF**.
- **Create Sourcing Request**.
- **Record an Offer** — currently disabled (placeholder).
- **Create a Quote** — navigates to this line's Quotes tab.
- **Update Status** — always visible.
- **Delete Request** — currently disabled (placeholder).

### Sales Order Details (`/sales/orders/:orderId/...`)
- **Share Order**.
- **Generate Order PDF**.
- **Account Approval** — opens the Account Approval checklist modal.
- **Document Approval** — opens the Document Approval checklist modal.
- **Create Shipment**.
- **Create Task**.
- **Submit for Approval** — only after required fields are filled.
- **Record Activity**.
- **No "Update Status" at this level — update via lines.**

### Sales Order Line Details (`/sales/orders/:orderId/line/:lineId/...`)
- **Parameter Approval** / **Undo Parameter Approval** — disabled until the line is locked.
- **Accounts Approval** / **Undo Accounts Approval**.
- **Export Approval** / **Undo Export Approval**.
- **Lock Line** — validates required fields first.
- **Unlock Line**.
- **Submit for Approval** — requires the line to be locked.
- **Create Shipment**.
- **Update Status**.
- **Generate CRR** — only when status is "Inspected" or later.

### Sourcing Request Details (`/purchasing/sourcing-requests/:srId/...`)
- **Request an Offer**.
- **Create a Purchase Order** — disabled until SR status reaches "Purchase For Request".
- **Add Allocation** — pull stock to allocate to this SR.
- **Add Line to Purchase Order**.
- **Attach an Offer**.
- **Update Status**.
- **Assign To** — bulk-update the team and buyers on the SR.

### Purchase Order Details (`/purchasing/purchase-orders/:poId/...`)
- **Download PO Doc** — only when the PO has approved lines.
- **Send Email** — sends the PO to the supplier; requires approved lines.
- **Add Arrival** — opens the PO Arrival Check wizard; requires at least one fully-approved line.
- **Cancel Purchase Order**.
- **No "Update Status" at this level — update via lines.**

### Purchase Order Line Details (`/purchasing/purchase-orders/:poId/line/:lineId/...`)
- **Parameter Approval** — requires the line to be locked.
- **Pricing Approval**.
- **Sourcing Approval**.
- **Submit for Approval** — only when line status is "Created" and not yet Approved; requires the line locked.
- **Lock Line** / **Unlock Line**.
- **Update Status**.
- **Download PO Doc**.
- **Add Arrival**.
- **Generate RR** — only when status is "Inspected" or later.
- **Cancel Line**.

### Offer Details (`/purchasing/offers/:offerId/...`)
The FAB menu changes based on the offer's current status. Common actions across statuses:
- **Update Status** — present in every status.
- **Update Unit Price** — present until the offer is closed.
- **Close Offer** — present until closed.
- **Mark as Aggressive Offer** — present in every status.
Status-specific extras: Edit Offer, Record Response, Request for Purchasing (Received/Recorded), Create Purchase Order / Attach PO (when on an SR detail page and SR is at "Purchase For Request" or later), Duplicate Offer, Create Quote.

### Account Details (`/accounts/:accountId/...`)
- **Create Contact**.
- **Upload BoM**.
- **Create RFQ**.
- **Create Sourcing Request(s)** — only on the RFQ tab when lines are selected.
- **Create Order**.
- **Create a Visit**.
- **Update Stage** — this is the account's "status" action; opens the Stage + Reason modal.
- **Reassign Account**.
- **Approve for Sales** — only when the account is a customer and not yet approved.
- **Approve for Purchase** — only for supplier / excess-seller accounts not yet approved.
- **Update Status** — only on the RFQ tab when RFQ lines are selected (this is the RFQ-line bulk Update Status, not an account-level status).
- *FAB is hidden entirely on the Parts tab.*

### Contact Details (`/contacts/:contactId/...`)
- **Invite to MyChip1** / **Resend Invitation** (whichever applies).
- **Campaign** — add the contact to an outreach campaign.
- **Create Contact**.
- **Upload BoM**.
- **Sell Excess** — creates an Excess Sales project for this contact.
- **Create RFQ**.
- **Create Order**.

### Project Details (`/projects/:projectId/...`)
- **Add Part**, **Upload BoM** / **Sell Excess**, **Edit Project**, **Archive Project**, **Share Project**, **Show/Hide in MyChip1**.
- **Update Status** — appears on the Project's RFQ tab when RFQ lines are selected (bulk-updates RFQ line statuses, not the project's status).

### Quote Line Details
**Quote Line Details has no FAB.** Quote-related actions live on the row context menu inside the RFQ's Quotes tab.

### Opportunities list (`/sales/opportunities`)
Opportunities have no detail page — they reuse the RFQ Details page (where the RFQ is flagged as an Opportunity).
- **Selection action bar** on the list: **Match Account** and **Update Status** when rows are selected.

---

## Action buttons that are NOT on the FAB

A few notable actions live elsewhere:

- **Add RFQ Line (inline button)** — on the RFQ Details → RFQ Lines tab, there is a top-of-table "Add RFQ Line" button (same modal as the FAB action).
- **Create Order Line (inline button)** — on Sales Order Details → Order Lines tab, a top-of-table "Create Order Line" button reveals an inline create form.
- **Create Shipment (from selection)** — on Sales Order Details → Order Lines tab, when lines are selected, a selection action bar appears with a "Create Shipment from selected lines" button.

---

## Selection action bars (table footer bars)

Many tables have a **selection action bar that appears at the bottom of the table when one or more rows are selected**. It is hidden when no rows are selected. The bar shows a "{count} selected" indicator, a "Clear" button, and the available bulk-action buttons.

Important behaviours to encode:

- **The bar only appears when ≥1 row is selected.** If a user asks where a bulk action is and they have nothing selected, the right answer is usually "select one or more rows first — the action bar will appear at the bottom of the table."
- **Individual buttons in the bar can be visible but disabled** when the selection doesn't meet that button's criteria (wrong row type, too few/many selected, mixed-supplier selection, etc.). Each disabled button carries a tooltip explaining why.
- **Whole bar can be hidden by feature flags / permissions** — if every button is filtered out, the bar renders nothing at all.
- This is a **separate** UI element from the FAB. Many entities have both: the FAB for create-or-single-target actions, the footer bar for bulk actions on selected rows.

### Where the selection action bar exists, by page

#### RFQs
- **RFQ list (`/sales/rfqs`) and RFQ Lines list (`/sales/rfqs/lines`)** —
  - **Create Sourcing Request(s)** — only on the Lines tab, only when ≥1 line is selected.
  - **Update Status** — disabled until at least one RFQ line is among the selection.
- **Contact Details → RFQs tab** — **Update Status** (disabled until ≥1 line selected).
- **No action bar** on: Account → RFQs tab, Project → RFQs tab, Part → RFQs tab. Bulk actions on these tabs go via the FAB instead.

#### Quotes (the most common confusion)
The Quotes selection action bar **exists in only one place: the Quotes tab on RFQ Line Details (`/sales/rfqs/:rfqId/line/:lineId/quotes`)**. It has three buttons:
- **Generate Quote PDF** — enabled when ≥1 parent quote row is selected. Hidden entirely if the `pdf-create` feature is off.
- **Create Sales Order(s)** — enabled when ≥1 row is selected. Requires `createOrder` permission and verifies the account is approved before opening the modal.
- **Send Quote(s)** — enabled only when **exactly 1 or 2** parent quote rows are selected. Hidden entirely if the `send-quote` feature is off.

The Quotes table on the **RFQ Details → Quotes tab** (`/sales/rfqs/:rfqId/quotes`) has **no selection action bar** — quote actions there live on the row context menu. Same for the standalone Quotes list (`/sales/quotes`) and Quote Line Details. If a user asks for bulk quote actions and they're not on the RFQ Line page, that's why they can't find the bar.

#### Opportunities (`/sales/opportunities`)
- **Match Account** — disabled until ≥1 opportunity-type row is selected; with ≥2 selected, checks they share the same MyChip1 account / users (mismatch shows a toast listing the conflicting requests).
- **Update Status** — disabled until ≥1 opportunity selected.

#### Sourcing Requests list (all sub-tabs: All / Offer Request / Purchase Request)
- **Update Status** — always enabled when ≥1 SR is selected.
- **Update Assigned to** — bulk-update team and buyers.
- **Create Offer(s)** — enabled only when all selected SRs share the same single preferred supplier. Tooltip when disabled: "Please select SRs having same supplier to create bulk offers."

#### Sales Order Details → Lines tab
- **Create Shipment from selected lines** — always enabled when ≥1 line is selected.

#### Purchase Orders
- **PO Lines list (`/purchasing/purchase-orders/lines`)** —
  - **Update QC Inspector** — always enabled when ≥1 line is selected.
  - ("Update Status" is **not** present on the standalone PO Lines list — only on PO Details → Lines tab below.)
- **PO Details → Lines tab (`/purchasing/purchase-orders/:poId`)** —
  - **Update Status**.
  - **Update QC Inspector**.
- **PO Receiving Lines list (`/purchasing/purchase-orders/receivingLines`)** — **Update QC Inspector**.

#### Contacts list (`/contacts`)
- **Add to Campaign** — gated by `outreach-campaign` feature flag (the entire bar is hidden if the flag is off). Always enabled when bar visible.

#### Tasks list (`/tasks`)
- **Add to** — add the selected tasks to an entity.
- **Add / Edit Start Date**.
- **Edit Due Date**.
- **Change Priority**.
- **Update Status** — opens a sub-menu with the four canonical statuses (Open / In Progress / On Hold / Completed).
- **Delete Task** — destructive (shown red).

#### Sourcing (Summary tab `/sourcing`)
- **Analyze MPNs** / **Remove from Analysis** — label flips depending on whether all selected MPNs are already in the Market Activity analysis set. Navigates to Market Activity (or strips them out).
- **Add {N} to Compare** / **Remove {N} from Compare** — label flips similarly. Add is disabled when adding would exceed the comparison limit.

### Tables that have NO selection action bar

- Accounts list, all Account Details child tabs.
- Parts list, all Part Details child tabs (Part RFQs / Orders / Quotes / Warehouse).
- Projects list, all Project Details child tabs.
- Sales Orders list (`/sales/orders`) and Order Lines list (`/sales/orders/lines`) — but Order Details → Lines tab does have one (see above).
- Offers list, Offer Bundle list, RFQ/SR → Offers tabs.
- Visits, Shipments, Warehouse Stock, Warehouse Receiving lists.
- Invoices list — selection state exists in code but no buttons are wired yet, so the bar never appears. Bulk-invoice actions are not available right now.
- Sourcing Request Details child tabs.

---

## Right-click does nothing useful

**Right-click is not a supported interaction in this CRM.** Users should use **left-click only**. Do not tell users to right-click a row, "open the context menu", or "use the row menu" — there is no useful row context menu for them to reach that way.

Every action a user might think of as a "row action" is reachable by left-click instead:

- **To act on a single item** → left-click the row to open its Details page, then use the **FAB** (bottom-right floating button) on that page.
- **To act on many items at once** → use the row's **checkbox** to select one or more rows, then use the **selection action bar** that appears at the bottom of the table.

If a user is stuck because they tried right-clicking and "nothing happened" or the menu was empty, redirect them to one of the two left-click paths above. Whichever entity-specific actions they need are documented in the "FAB actions per entity" and "Selection action bars" sections above.

---

## Quick-actions pill (small secondary FAB)

Some detail pages also show a smaller secondary pill of icon buttons stacked above the main FAB. The most common item there is **Comments**. This is separate from the main FAB menu.

---

## Things the agent should never say

- **"There's an Update Status button at the top of the page."** There isn't. It's on the FAB (and sometimes the selection action bar).
- **"Click the action menu near the top."** Most detail pages have no top action menu — actions are on the FAB.
- **"Update the RFQ's status from the RFQ page."** The RFQ itself has no status field — instead, update its lines. Phrase this correctly.
- **"Update Status for a Sales Order / Purchase Order."** Neither entity has a direct status-update action — they are derived from their lines.
- **"Update Status for a Quote."** Quotes have no Update Status action at all.
- **"Right-click the row…"** / **"Open the context menu…"** / **"Use the row menu…"** Right-click does nothing useful in this CRM. Always direct users to **left-click** the row (to open Details + use the FAB) or to the row **checkbox + selection action bar** for bulk actions.
