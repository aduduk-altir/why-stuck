# Troubleshooting Guide — CRM App (chip1-webui/apps/crm)

This guide covers situations where a user gets stuck and what they should do next. Each entry describes a stuck state and the exact action to resolve it.

---

## Authentication and Login

**Stuck: Entered email address but nothing happened or got an error.**
- Make sure the email is a valid work email address (e.g., name@company.com).
- The email must belong to a Chip1 account. If the email is not recognized, contact your administrator to confirm the correct login email.

**Stuck: "Invalid password. Please try again." error on the sign-in page.**
- Double-check that Caps Lock is not on.
- Try clicking "Forgot Password?" to receive a one-time reset code by email.
- If the problem continues after resetting, contact your administrator.

**Stuck: "Invalid code. Please try again." error when entering the one-time code.**
- The code expires quickly. Click "Resend code" to get a fresh code.
- Check your spam or junk folder if the email code has not arrived.
- Make sure you are entering the most recent code, not an old one.

**Stuck: Stuck on the "Enter Your Temporary Password" screen (first login).**
- Check your email for the welcome message from Chip1. It contains the temporary password.
- Enter that temporary password in the first field, then create your own new password in the next fields.
- The new password must be at least 8 characters and include an uppercase letter, a number, and a symbol.
- If "Passwords must match" appears, make sure the New Password and Confirm Password fields are identical.

**Stuck: "Oops, profile not found" or "Access Denied" error after signing in.**
- Your account may not be fully set up. Contact your administrator to make sure your user profile and permissions are configured.
- Try signing out and signing back in.

**Stuck: "Oops, something went wrong" error on any page.**
- Reload the page (press F5 or Ctrl+R on Windows, Cmd+R on Mac).
- If the error persists after reloading, contact support.

---

## General Navigation

**Stuck: Page says "Coming Soon."**
- This feature is not yet available. No action is needed — it will be enabled when released.

**Stuck: Page says "Oops, the page wasn't found!"**
- The URL may be incorrect or the item you were looking for may have been deleted.
- Use the main navigation menu on the left to go back to a list page.

**Stuck: A section or field shows "Section is locked for editing."**
- This section is currently locked and cannot be edited. This typically happens when a record is in a certain status that prevents changes. To unlock, the status of the record may need to change first — check the current status of the item.

---

## Account Pages

**Stuck: Cannot save changes on the Account Details — General Info section.**
- Make sure Account Name is filled in (3 to 50 characters).
- Make sure Account Type, Stage, and Website are all filled in.
- Make sure at least one Industry is selected.
- If the account already has a primary contact, the Email field becomes required.

**Stuck: "Must be a valid URL" error on website or social media fields.**
- URLs must start with http:// or https://. For example: https://www.company.com.

**Stuck: Cannot add a second external ID of the same type.**
- Each external ID type can only be used once. If you need to update an existing ID, edit the current entry rather than adding a new one.

**Stuck: Cannot save Account Addresses.**
- Every address must have at least one Address Type selected (such as Billing or Shipping). Select a type from the dropdown next to the address.

**Stuck: Cannot save the Invoicing & Payment section when Invoice Preference is "Email."**
- If no email address has been added to the email list, at least one billing contact must be selected that has an email on file.
- Add an email address to the email list, or select a contact who has a valid email.

**Stuck: Cannot save the Invoicing & Payment section when Invoice Preference is "Online."**
- A website URL is required when the invoice preference is set to Online. Enter the supplier's invoice portal URL.

**Stuck: Credit Insurance fields are grayed out or required fields appear when saving credit info.**
- If the "Has Credit Insurance" checkbox is on, the Insured Limit field is required and must be a positive number.

---

## Contact Pages

**Stuck: "Enter either email or phone number" error when creating or editing a contact.**
- At least one of these must be provided: a valid email address, or a complete phone number (country code + number).
- If you started entering a phone but left it partial, either complete it or clear it entirely.

**Stuck: "Invalid phone" error on a contact.**
- The phone number must include both the country code (e.g., +1) and the phone number itself.
- A partial phone entry (country code only, or number only without a country code) is not accepted.

**Stuck: Account field is required on a new contact but you do not see one to select.**
- The Account field is only optional if the contact's Status is set to "Lead." If the status is anything other than Lead, an account must be selected.
- Search for the account by typing in the account field. If the account does not exist, it must be created first.

---

## RFQ (Requests for Quote) Pages

**Stuck: Cannot submit a new RFQ.**
- A contact must be selected (not just typed — it must be chosen from the dropdown list).
- Each line item must have a Part / MPN selected, a quantity, a Line Type, a Priority Level, and an Origin Source.
- Quantity must be a positive whole number.

**Stuck: "Phone number and contact are mandatory for RFQ" error.**
- The selected contact for this RFQ does not have a phone number on file. Go to the contact's profile and add a phone number, then come back and retry.

**Stuck: "Role is required" error in the People section of an RFQ.**
- Each user added to the RFQ team must have a role assigned. Select a role from the dropdown next to each user's name.

**Stuck: Cannot change an RFQ line status without selecting a sub-status.**
- Some status transitions require a detailed sub-status to be chosen as well. Select the appropriate sub-status from the dropdown that appears after selecting the new status.

**Stuck: "Contact email is required" error when requesting an offer from a supplier.**
- The contact selected for this supplier does not have an email address on file. Go to the contact's profile, add a valid email, and then retry the request.

**Stuck: What does the "Closed" filter on the RFQ Lines table do? Does it hide open items?**
- The "Closed" filter (toggled via the "Show Closed" button) shows **both closed and open items together** — it does not restrict the table to only closed items. Turning it on widens the view to include closed lines alongside the open ones; turning it off hides closed lines so you see only open ones.

**Stuck: How do I update the status of an RFQ?**
- RFQs do not have an entity-level status — RFQ "status" is the status of its lines. On the RFQ Details page, open the **RFQ Lines** tab, select one or more line rows, then click the **FAB** (the round floating button at the bottom-right of the page) and choose **"Update Status"**. The "Update Status" item only appears on the FAB when at least one line is selected.
- Alternative: right-click a single line row and choose "Update Status", or use the selection action bar that appears at the bottom of the lines table when rows are selected.

**Stuck: How do I update the status of a single RFQ line?**
- Open the RFQ Line Details page → click the **FAB** (bottom-right) → **"Update Status"**. Always visible (no row selection needed). The modal also shows the sub-status field when the chosen status requires one.

**Stuck: Where are the sourcing requests related to this RFQ?**
- They live on the **Offers** tab of the RFQ Details page, in the **"Sourcing Requests Assigned"** table at the top. They are not on the "Sourcing Analysis" tab — that tab is a market-data dashboard, not a list of sourcing requests.

---

## Sales Order Pages

**Stuck: Cannot submit a new Sales Order.**
- Check that all required fields are filled: Account, Contact, Customer PO Number, Customer PO Date, Tax Rate, Ship Via, Shipping Account Number, Inco Terms, Inco City, Sales Person, and Payment Terms.
- The selected contact must have a phone number on file. If the contact has no phone, the order cannot proceed until a phone is added to that contact's profile.
- Each order line must have: Part / MPN, Quantity (positive whole number), Cost Per Unit (positive number), Date Code Year, Date Code Week, Packaging Type, and all the yes/no checkbox fields (Black Labels, Partial Reels, etc.).

**Stuck: Order cannot be submitted for approval, or approval button is disabled.**
- The order must have all of the following complete before it can go to approval:
  - Account set.
  - At least one contact added.
  - Sales Person assigned.
  - Customer PO Number filled in.
  - Shipping Address selected.
  - Inco Terms set.
  - Inco City filled in.
  - Carrier (Ship Using) set.
  - Shipping Account Number filled in.
  - Billing Address set.
  - Payment Terms set.
  - Tax Rate set.
- Check each section in the Order Details tab (People, Shipping, Billing) and fill in anything missing.

**Stuck: "Past dates are not allowed" on Promised Delivery Date.**
- The delivery date must be today or a future date. Clear the field or enter a date that is today or later.

**Stuck: How do I update the status of a Sales Order?**
- Sales Orders do not have an entity-level Update Status action — the order's status is derived from the statuses of its lines. To change it, open an **Order Line Details** page → click the **FAB** (bottom-right) → **"Update Status"**.

**Stuck: How do I update the status of a single Sales Order line?**
- Open the **Order Line Details** page → **FAB** → **"Update Status"**.

---

## Purchase Order Pages

**Stuck: Cannot create a new Purchase Order.**
- Supplier, Contact, Payment Terms, Tax Rate, Carrier, and Shipping Account Number are all required.
- Each PO line needs: Part / MPN, Quantity (positive whole number), Unit Price (positive number), QC Level, Expected Delivery Date, and CPN.

**Stuck: "Cannot be later than two days before the need-by date" error on Expected Delivery Date.**
- The Expected Delivery Date must be at least 2 days before the Need By date on that line.
- Either move the Expected Delivery Date earlier, or extend the Need By date.

**Stuck: Cannot send a Purchase Order.**
- The email field must be a valid email address.
- The subject line and message body cannot be empty.

**Stuck: Cannot update a PO line status to "Shipped."**
- When moving to Shipped status, a Quantity Shipped (positive number) is required.

**Stuck: Cannot update a PO line status to "Arrived."**
- When moving to Arrived status, a Quantity Arrived (positive number) is required.

**Stuck: PO Arrival Check form will not proceed past the first step.**
- Step 1 requires: Boxes Condition, Number of Boxes (whole number), Weight, and Weight Unit — all must be filled in.

**Stuck: How do I update the status of a Purchase Order?**
- Purchase Orders do not have an entity-level Update Status action — the PO's status is derived from the statuses of its lines. To change it, open a **PO Line Details** page → **FAB** (bottom-right) → **"Update Status"**, or right-click a PO line row in the PO list and choose "Update Status".

---

## Sourcing Request Pages

**Stuck: Cannot create a Sourcing Request.**
- Quantity must be a positive whole number.
- Priority Level is required.
- Either an Assigned Team or at least one Buyer must be assigned. Leaving both empty gives the error "Buying Team or Buyers is required."
- Sales Person is required.

**Stuck: "Buying Team or Buyers is required" error on a Sourcing Request or in the bulk team update modal.**
- At least one team or at least one buyer must be selected before saving. Both cannot be empty.

**Stuck: How do I update the status of a Sourcing Request?**
- Open the Sourcing Request Details page → **FAB** (bottom-right) → **"Update Status"**. Also available by right-clicking a row in the Sourcing Requests list or using the bulk selection action bar when rows are selected.

---

## Shipment Pages

**Stuck: Cannot create a shipment from an order line.**
- At least one line must have a quantity entered, and the quantity must be a positive whole number.

**Stuck: Cannot save the Billing section on a Shipment.**
- Billing Address and Invoice Preferred Method are both required.
- If Invoice Preferred Method is "Online," a website URL is also required.
- Payment Terms and Tax Rate are required.

---

## Visit Pages

**Stuck: Cannot save a new Visit — Details step.**
- Trip is required (the visit must be linked to a trip).
- Customer Account is required.
- Visit Type, Status, and Date are all required.
- At least one Chip1 Participant and at least one Customer Participant must be added.

**Stuck: Cannot proceed to the Topics and Notes step.**
- All fields in Step 1 (Details) must be valid. Fix any red error indicators on that step before clicking Next.

**Stuck: Cannot complete a visit.**
- Notes are required to complete a visit. Enter a summary of what happened.

---

## Trip Pages

**Stuck: Cannot create a Trip.**
- Trip Name is required.
- Both a start date and an end date must be set for the Trip Dates.
- At least one Participant must be added.
- Location (address) is required.

---

## Stock / Warehouse Pages

**Stuck: Cannot create a new stock entry.**
- Part / MPN is required (must be selected from the search, not just typed).
- Quantity Received is required and must be a positive whole number.

**Stuck: Cannot complete the "Mark as QC Received" action.**
- A QC Inspector user must be selected from the dropdown.

**Stuck: Cannot complete the "Reserve Quantity" action.**
- Reserved Quantity must be a whole number between 0 and the currently available quantity.
- Reserved On date is required.

**Stuck: Cannot move stock to a new status.**
- The new Status field must be filled. If moving to "QC Received" status, a QC Inspector must also be selected.

---

## Quality Control Forms (Order Lines)

**Stuck: Cannot save the Quality Control Validation Process form.**
- All seven inspection categories (Packaging, Labels, Device Body, Device Leads, Product Spec Sheet, Dimensions, Device Surface) must have a result selected.

**Stuck: Cannot save the Quality Control Analysis Documents form.**
- All three analysis results (XRF Analysis, Solderability, Shield Image Analysis) must be selected.

**Stuck: Cannot save the Quality Control Conclusion form.**
- The Final Result field is required.

---

## Offer Pages

**Stuck: Cannot create an Offer.**
- Supplier and Contact are required.
- Offer Type is required.
- Unit Price is required and must be a positive number for each offer line.

**Stuck: "Contact email is required" error when requesting an offer.**
- The contact you selected does not have an email address in the system. Open the contact's profile, add an email, then come back and retry.

**Stuck: Cannot save "Request Offer for Purchase" — Due Date error.**
- The Due Date field is required. Select a date from the calendar.

**Stuck: How do I update the status of an Offer?**
- Open the Offer Details page → **FAB** (bottom-right) → **"Update Status"**. Also available by right-clicking an offer row in any list that shows offers (Offers list, RFQ → Offers tab, Sourcing Request → Offers tab, Order Line → Offers tab). The FAB menu options change based on the offer's current status.

---

## Account Pages — Stage / Status

**Stuck: How do I update the status of an Account?**
- Accounts have a field called **Stage**, not Status. To change it, open the Account Details page → **FAB** (bottom-right) → **"Update Stage"**. The modal asks for the new Stage and a reason.

---

## Quote Pages — Status

**Stuck: How do I update the status of a Quote?**
- Quotes do not have an Update Status action. Quote state transitions happen indirectly through other actions: Recommend / Unrecommend, Send Quote, Create Sales Order from this Quote, etc. To take those actions, right-click a quote row inside the RFQ's Quotes tab.

**Stuck: Where are the bulk actions for Quotes? I can't find "Send Quote" or "Generate PDF" or "Create Sales Order".**
- The bulk-action bar for Quotes only appears on the **RFQ Line Details → Quotes tab** (URL `/sales/rfqs/:rfqId/line/:lineId/quotes` — drill down one level past the RFQ). Select one or more quote rows; the footer action bar then shows **Generate Quote PDF**, **Create Sales Order(s)**, and **Send Quote(s)**.
- These actions are **not available on the RFQ Details → Quotes tab** (one level up — `/sales/rfqs/:rfqId/quotes`) or on the standalone Quotes list (`/sales/quotes`). From those pages, use the row context menu (right-click) instead for per-quote actions.
- "Send Quote(s)" is enabled only when **1 or 2** parent-quote rows are selected (not more). "Generate Quote PDF" needs at least one parent-quote row in the selection; selecting only quote-line sub-rows leaves the button disabled.

---

## Campaign Pages

**Stuck: Cannot save a Campaign on Step 1.**
- Campaign Name is required.
- Maximum Follow-Ups and Follow-Up Delay Days are both required numbers.

---

## Admin — User Management

**Stuck: Cannot create a new user.**
- All of these must be filled: First Name, Last Name, Phone, Email, Office, Department, Manager, Status.
- At least one Role and at least one Permission must be assigned.
- Email must be a valid email format.
- Phone must have a country code and phone number.

---

## Document / File Upload

**Stuck: File upload error — "Too many files."**
- Only a certain number of files can be uploaded at once. Upload fewer files at a time.

**Stuck: File upload error — "Unsupported format."**
- The file type is not allowed. Check the accepted formats shown in the upload area and use a supported file type.

**Stuck: File upload error — "File size limit exceeded."**
- The file is too large. Compress or reduce the file size before uploading.

---

## General "Something Went Wrong" Issues

**Stuck: "Oops, something went wrong" when trying to save any form.**
- Check that all required fields are filled and there are no red error messages on the form.
- If all fields look correct, try reloading the page (F5 or browser refresh) and trying again.
- If the error continues, contact support with the name of the page and what you were trying to do.

**Stuck: Data on the page did not load — "Oops! Data didn't load as expected."**
- Click the "Retry" button if one is shown.
- Reload the page.
- If the problem continues, contact support.

**Stuck: "Access Denied" — cannot see a page or section.**
- You do not have the necessary permission for that area. Contact your administrator to request access.
