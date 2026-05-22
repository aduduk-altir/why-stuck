# Routing Map — CRM App (chip1-webui/apps/crm)

This is the internal CRM tool used by Chip1 sales and purchasing staff. The URL patterns below describe what the user is doing on each page.

---

## Authentication Pages

- `/auth` — Welcome / Identity page. User enters their email address to start signing in.
- `/auth/sign-in` — Password or one-time code entry page. User enters their password or a 6-digit code sent to their email or phone.
- `/auth/create-password` — First-login page. New user enters the temporary password emailed to them, then creates a new password.
- `/auth/forgot-password` — Forgot password page. User receives a one-time code to reset their password.

---

## Dashboard

- `/dashboard` — Main home dashboard. Shows key metrics, follow-up flags, recent activity, and quick access to common actions.

---

## Accounts

- `/accounts/my` — My Accounts list. Shows the accounts assigned to the current user.
- `/accounts/all` — All Accounts list. Shows every account in the system.
- `/accounts/search` — Account search landing page.
- `/accounts/search/results` — Account search results page.
- `/accounts/:accountId` — Account Details — general information tab for a specific company account.
- `/accounts/:accountId/contacts` — Account Details, Contacts tab. Lists all contacts at this account.
- `/accounts/:accountId/projects` — Account Details, Projects tab. Lists all projects linked to this account.
- `/accounts/:accountId/quotes` — Account Details, Quotes tab. Lists all quotes for this account.
- `/accounts/:accountId/orders` — Account Details, Orders tab. Lists sales orders for this account.
- `/accounts/:accountId/hierarchy` — Account Details, Hierarchy tab. Shows parent/child company relationships.
- `/accounts/:accountId/rfqs` — Account Details, RFQs tab. Lists all requests for quotes from this account.
- `/accounts/:accountId/parts/*` — Account Details, Parts tab. Shows parts associated with this account.
- `/accounts/:accountId/tasks/*` — Account Details, Tasks tab.
- `/accounts/:accountId/timeline` — Account Details, Timeline tab. Shows communication and activity history.
- `/accounts/:accountId/visits` — Account Details, Visits tab. Shows field visit records.
- `/accounts/:accountId/purchaseOrders/*` — Account Details, Purchase Orders tab.
- `/accounts/visits` — All Visits list. Shows all scheduled or completed customer visits.
- `/accounts/trips` — All Trips list. Shows multi-stop travel trips for sales visits.

---

## Contacts

- `/contacts` — Contacts list. Shows all people in the system (customers, leads, etc.).
- `/contacts/:contactId` — Contact Details — general info for a person.
- `/contacts/:contactId/projects` — Contact Details, Projects tab.
- `/contacts/:contactId/orders` — Contact Details, Orders tab.
- `/contacts/:contactId/quotes` — Contact Details, Quotes tab.
- `/contacts/:contactId/rfqs` — Contact Details, RFQs tab.
- `/contacts/:contactId/tasks/*` — Contact Details, Tasks tab.
- `/contacts/:contactId/timeline/*` — Contact Details, Timeline tab. Shows full activity history for this contact.

---

## Projects

- `/projects` — Projects list. Shows all projects (usually representing a customer's BOM or product program).
- `/projects/:projectId` — Project Details.
- `/projects/:projectId/quotes/*` — Project Details, Quotes tab.
- `/projects/:projectId/orders` — Project Details, Orders tab.
- `/projects/:projectId/rfqs` — Project Details, RFQs tab.
- `/projects/:projectId/health-history/*` — Project Details, Health History tab.
- `/projects/:projectId/tasks/*` — Project Details, Tasks tab.
- `/projects/:projectId/timeline/*` — Project Details, Timeline tab.

---

## Parts

- `/parts` — Parts list. Shows all electronic components in the system.
- `/parts/activity` — Part Activity list.
- `/parts/health-report` — Part Health Report (full view).
- `/part-health-report` — Part Health Report (alternate CRM entry point).
- `/parts/:partId` — Part Details.
- `/parts/:partId/documents/*` — Part Details, Documents tab.
- `/parts/:partId/quotes/*` — Part Details, Quotes tab.
- `/parts/:partId/rfqs` — Part Details, RFQs tab.
- `/parts/:partId/projects` — Part Details, Projects tab.
- `/parts/:partId/orders` — Part Details, Orders tab.
- `/parts/:partId/tasks/*` — Part Details, Tasks tab.
- `/parts/:partId/timeline/*` — Part Details, Timeline tab.
- `/system-components/list` — System Components list.
- `/system-components/semiconductors` — Semiconductors list within System Components.

---

## Sales — RFQs (Requests for Quote)

- `/sales/rfqs` — RFQ list. Shows all inbound customer requests for component pricing.
- `/sales/rfqs/lines` — RFQ Lines list. Shows individual line items across all RFQs.
- `/sales/rfqs/:rfqId` — RFQ Details. Shows details of a specific request.
- `/sales/rfqs/:rfqId/line/:lineId` — RFQ Line Details. Shows a specific part request within an RFQ.
- `/sales/rfqs/:rfqId/quotes` — RFQ Details, Quotes tab.
- `/sales/rfqs/:rfqId/tasks/*` — RFQ Details, Tasks tab.
- `/sales/rfqs/:rfqId/timeline/*` — RFQ Details, Timeline tab.

---

## Sales — Quotes

- `/sales/quotes` — Quotes list. Shows price quotes sent to customers.
- `/sales/quotes/active` — Active/open quotes.
- `/sales/quotes/line/:quoteLineId` — Quote Line Details.

---

## Sales — Orders

- `/sales/orders` — Sales Orders list. Shows all confirmed customer orders.
- `/sales/orders/lines` — Sales Order Lines list. Shows individual line items across all orders.
- `/sales/orders/:orderId` — Order Details.
- `/sales/orders/:orderId/line/:lineId` — Order Line Details.
- `/sales/orders/:orderId/rfqs` — Order Details, RFQs tab.
- `/sales/orders/:orderId/tasks/*` — Order Details, Tasks tab.
- `/sales/orders/:orderId/timeline/*` — Order Details, Timeline tab.

---

## Sales — Opportunities

- `/sales/opportunities` — Opportunities list. Shows sales pipeline items that haven't yet become RFQs or orders.

---

## Sales — Invoices

- `/sales/invoices` — Invoices list. Shows outbound customer invoices (feature-gated).
- `/sales/invoices/:invoiceId` — Invoice Details.
- `/sales/invoices/:invoiceId/line/:lineId` — Invoice Line Details.
- `/sales/invoices/:invoiceId/tasks/*` — Invoice Details, Tasks tab.
- `/sales/invoices/:invoiceId/activity/*` — Invoice Details, Activity tab.

---

## Purchasing — Sourcing Requests

- `/purchasing/sourcing-requests` — Sourcing Requests list. Shows internal requests to procure components.
- `/purchasing/sourcing-requests/offer-request` — Sourcing Requests filtered to offer requests.
- `/purchasing/sourcing-requests/purchase-request` — Sourcing Requests filtered to purchase requests.
- `/purchasing/sourcing-requests/:srId` — Sourcing Request Details.
- `/purchasing/sourcing-requests/:srId/salesOrders` — SR Details, Sales Orders tab.
- `/purchasing/sourcing-requests/:srId/sourcing` — SR Details, Sourcing Analysis tab.
- `/purchasing/sourcing-requests/:srId/tasks/*` — SR Details, Tasks tab.
- `/purchasing/sourcing-requests/:srId/timeline/*` — SR Details, Timeline tab.
- `/purchasing/sourcing-requests/:srId/purchaseOrder/*` — SR Details, Purchase Orders tab.

---

## Purchasing — Purchase Orders

- `/purchasing/purchase-orders` — Purchase Orders list. Shows orders placed with suppliers.
- `/purchasing/purchase-orders/lines` — PO Lines list.
- `/purchasing/purchase-orders/:poId` — Purchase Order Details.
- `/purchasing/purchase-orders/:poId/line/:lineId` — PO Line Details.
- `/purchasing/purchase-orders/:poId/tasks/*` — PO Details, Tasks tab.
- `/purchasing/purchase-orders/:poId/timeline/*` — PO Details, Timeline tab.
- `/purchasing/purchase-orders/:poId/documents/*` — PO Details, Documents tab.
- `/purchasing/purchase-orders/:poId/quality-control/*` — PO Details, Quality Control tab.
- `/purchasing/purchase-orders/:poId/related` — PO Details, Related Items tab.

---

## Purchasing — Receiving Lines (Stock Received from Suppliers)

- `/purchasing/receiving-lines/:stockId` — Receiving Line Details. A unit of stock received against a purchase order.
- `/purchasing/receiving-lines/:stockId/quality-control` — Receiving Line QC tab.
- `/purchasing/receiving-lines/:stockId/part-document/*` — Receiving Line Part Document tab.
- `/purchasing/receiving-lines/:stockId/tasks/*` — Receiving Line Tasks tab.
- `/purchasing/receiving-lines/:stockId/timeline/*` — Receiving Line Timeline tab.
- `/purchasing/receiving-lines/:stockId/documents/*` — Receiving Line Documents tab.

---

## Purchasing — Offers (Supplier Offers)

- `/purchasing/offers` — Offers landing (Coming Soon placeholder).
- `/purchasing/offers/all` — All Offers list.
- `/purchasing/offers/lists` — Offer Bundles list. Groups of offers from the same supplier.
- `/purchasing/offers/lists/:bundleId` — Offer Bundle Details.
- `/purchasing/offers/:offerId` — Offer Details.
- `/purchasing/offers/:offerId/part` — Offer Details, Part tab.
- `/purchasing/offers/:offerId/documents` — Offer Details, Documents tab.
- `/purchasing/offers/:offerId/tasks/*` — Offer Details, Tasks tab.
- `/purchasing/offers/:offerId/notes` — Offer Details, Notes tab.
- `/purchasing/offers/:offerId/related` — Offer Details, Related Items tab.
- `/purchasing/offers/:offerId/timeline/*` — Offer Details, Timeline tab.

---

## Warehouse

- `/warehouse/stock` — Warehouse Stock list. Shows all physical inventory currently held.
- `/warehouse/receiving` — Receiving list. Incoming shipments waiting to be processed.
- `/warehouse/sales-orders` — Warehouse Sales Orders list.
- `/warehouse/parts` — Warehouse Parts list.
- `/warehouse/stock-lines/:stockId` — Stock Line Details. A specific unit of inventory.
- `/warehouse/lots/:lotId` — Lot Details. A grouped batch of inventory.
- `/warehouse/shipments` — Shipments list. Outbound deliveries to customers.
- `/warehouse/shipments/:shipmentId` — Shipment Details.
- `/warehouse/label-generator` — Label Generator. Creates physical labels for stock.

---

## Sourcing Analytics

- `/sourcing/summary` — Sourcing Summary dashboard.
- `/sourcing/market-activity` — Market Activity analytics.
- `/sourcing/sales-activity` — Sales Activity analytics.
- `/sourcing/purchasing-activity` — Purchasing Activity analytics.
- `/sourcing/stock` — Sourcing Stock view.

---

## RMAs (Return Merchandise Authorizations)

- `/rma/customer` — Customer RMA list. Returns from customers.
- `/rma/supplier` — Supplier RMA list. Returns to suppliers.
- `/rma/:rmaId` — RMA Details.

---

## Tasks

- `/tasks` — Tasks list. Shows all assigned to-dos and follow-up tasks.
- `/task/:taskId` — Deep link to a specific task.

---

## Campaigns (Outreach — feature-gated)

- `/campaign` — Campaigns list. Email outreach campaigns to contacts.
- `/campaign/:campaignId` — Campaign Details.
- `/campaign/:campaignId/contacts` — Campaign Details, Contacts tab.

---

## Admin

- `/admin/users` — Admin: User Management. Create and manage CRM user accounts.
- `/admin/tags` — Admin: Tag Management. Manage system-wide tags.

---

## Notifications

- `/notifications` — Notifications list (feature-gated).

---

## Other

- `/coming-soon` — Placeholder page for features not yet available.
- `/link/:slug` — External link redirect (feature-gated).
