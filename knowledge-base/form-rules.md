# Form Rules — CRM App (chip1-webui/apps/crm)

All fields marked with an asterisk (*) are required unless noted otherwise. Dropdown, lookup, and autocomplete fields must have a value selected from the list — typing alone does not satisfy the requirement.

---

## Sign In / Authentication

### Enter Email (Identity page — /auth)
- Email Address: required, must be a valid email format.
- Remember Me: optional checkbox.

### Sign In with Password (/auth/sign-in)
- Password: required. If wrong, the message "Invalid password. Please try again." appears.
- There is also a "Use a one-time code" option, which sends a 6-digit code to the email or phone on file.

### Sign In with One-Time Code (/auth/sign-in, OTP mode)
- 6-digit code: required. Must be exactly 6 digits. If wrong, "Invalid code. Please try again." appears.
- There is a "Resend code" option if the code was not received.

### Create / Set Password (/auth/create-password)
- Temporary Password (OTP): required, exactly 6 characters.
- New Password: required, at least 8 characters, must include at least one uppercase letter, one number, and one symbol.
- Confirm Password: required, must exactly match the new password field. Error: "Passwords must match."

### Forgot Password (/auth/forgot-password)
- Follows the same one-time code flow as OTP sign-in.

---

## My Profile (/auth/profile or via the profile menu)
- Title: required (salutation such as Mr., Ms., Dr., etc.).
- First Name: required.
- Last Name: required.
- Email Address: required, must be a valid email.
- Phone Number: required, must include a country code and phone number.
- Date of Birth: optional.
- Nationality: optional.
- Languages: optional, multiple can be added.
- LinkedIn URL: optional, must be a valid URL if entered.
- Skype: optional.

---

## Create Account (modal)
- Account Name: required, 3–50 characters.
- Account Type(s): required, at least one must be selected.
- Stage: required.
- Website: required, must be a valid URL.
- Industry: at least one required.
- Phone: required, must include country code and phone number.
- Email: optional.
- Primary Contact: optional (search for an existing contact).
- Account Owner: optional (search for a user).
- Address — Country: required.
- Payment Terms: required.

### Edit Account — General Info
- Account Name: required, 3–50 characters.
- Type: required.
- Stage: required.
- Website: required, valid URL.
- Industries: required.
- Do Not Contact flag: required (yes/no toggle).
- Do Not Visit flag: required (yes/no toggle).
- Email: required only if the account has a primary contact already assigned; otherwise optional.
- LinkedIn, Facebook, Twitter URLs: optional, must be valid URLs if entered.

### Edit Account — Addresses
- Each address must have at least one Address Type selected (e.g., Billing, Shipping).
- Address fields (Street, City, Country) are required for addresses added.

### Edit Account — Invoicing & Payment
- Invoice Preference Mode: required (e.g., Email, Online, Postal Address).
- If mode is "Online", a website URL is required.
- If mode is "Email" and no email address is entered, then at least one billing contact with a valid email must be selected.
- Payment Terms: optional.
- Tax Percent: optional.
- Follow-up emails: if added, each must have a type and valid email address.

### Edit Account — Credit Info
- Credibility: required.
- Currency: required.
- If Credit Insurance is enabled: Insured Limit must be a positive number.

### Edit Account — External IDs
- Each ID must have a value and a source/type. No two IDs can share the same type.

### Reassign Account
- New Account Owner: required (select a user).
- Timeline Note: optional.

---

## Create Contact (modal)
- First Name: required, 2–100 characters.
- Last Name: required, 2–100 characters.
- Email OR Phone: at least one is required. If both are blank, an error appears on the email field saying "Enter either email or phone number."
  - Email: optional alone, but must be a valid email if entered.
  - Phone: if a phone is started (country code or number entered), both the country code and phone number must be filled in, and the phone number must be valid.
- Account: required, unless the contact's status is "Lead" — then it is optional.
- LinkedIn URL: optional, must be a valid URL if entered.
- Company Website: optional, must be a valid URL if entered.
- Title: optional.
- Communication Preferences: optional.
- Language: optional.
- Source: optional.

### Edit Contact — General Info
- First Name: required, 2–100 characters.
- Last Name: required, 2–100 characters.
- Stage: optional.
- Source: optional.
- If contact is marked Inactive, an Inactive Reason is required.

### Edit Contact — Communications
- Emails and Phones: at least one valid email or phone number must be on file. If neither is present, error: "Enter either email or phone number."
- Each phone added must have both a country code and phone number.
- Each email must be a valid email format.
- LinkedIn, Facebook, Instagram, Twitter URLs: optional, must be valid URLs if entered.

---

## Create RFQ / New Request (Create Request form)
- Contact: required (must select a person from the system).
- Account: required if the contact is not a Lead and the Opportunity feature is enabled. Otherwise optional.
- Each RFQ line requires:
  - Part / MPN: required (search for a component).
  - Quantity: required, must be a positive whole number.
  - Line Type: required.
  - Priority Level: required.
  - Origin Source: required.
  - Need By date: optional, but if entered must be today or a future date.
  - Target Price: optional, must be zero or greater if entered.
- Sales Person: optional.

### RFQ Details — Opportunity section
- Line Type: required.
- Priority Level: required.
- Origin Source: required.
- Sourcing Type: optional.

### RFQ Details — Requirements section
- Quantity: required, positive whole number.
- Need By date: optional.
- Target Price: optional, must be zero or greater.

### RFQ Details — Shipping section
- All shipping fields (address, carrier, inco terms) are optional — no required fields in this section.

### Send Quote (modal)
- Account: required.
- Primary Contact: required.
- Message Body: required.
- Email: required, must be a valid email.

---

## Create Sales Order

- Account: required.
- Contact: required. The selected contact must have at least one phone number on file — if the contact has no phone, an error appears on the phone field.
- Customer PO Number: required.
- Customer PO Date: required.
- Tax Rate: required.
- Ship Via (carrier): required.
- Shipping Account Number: required.
- Inco Terms: required.
- Inco City: required.
- Sales Person: required.
- Payment Terms: required.
- Each order line requires:
  - Part / MPN: required.
  - Quantity: required, positive whole number.
  - Cost Per Unit: required, positive number.
  - Date Code Year: required.
  - Date Code Week: required.
  - Packaging Type: required.
  - Black Labels OK: required (yes/no).
  - Partial Reels OK: required (yes/no).
  - No Labels OK: required (yes/no).
  - Supplier Label Allowed: required (yes/no).
  - Warranty Accepted by Sales: required.
  - Part Condition Accepted by Sales: required.
  - Origin Source: required.
  - Sourcing Type: required.
  - CPN (Customer Part Number): required.
  - Promised Delivery Date: optional, must be today or a future date if entered.
  - Ship Options Display: required.

### Order Before Approval — Required Fields
Before an order can be submitted for approval, all of the following must be filled in:
- Account must be set.
- At least one contact must be added.
- Sales Person must be assigned.
- Customer PO Number must be filled in.
- Shipping Address must be selected.
- Inco Terms must be set.
- Inco City must be filled in.
- Ship Using (carrier) must be set.
- Shipping Account Number must be filled in.
- Billing Address must be set.
- Payment Terms must be set.
- Tax Rate must be set.

### Order Details — People & Account section
- Customer PO Number: required.
- Account: required.
- Account Owner: required.

### Order Details — Billing section
- Billing Address: required.
- Payment Terms: required.
- Tax Rate: required.
- Invoice Approved: required (yes/no).

### Record Pre-Payment (modal)
- Amount: required, must be a positive number (cannot exceed the remaining balance if a balance exists).
- Currency: required.
- Payment Mode: required.
- Payment Date: required.
- Notes: optional.

### Record Payment (modal)
- Same as pre-payment plus an optional "Paid By" field.

---

## Create Purchase Order

- Supplier (account): required.
- Contact (supplier contact): required.
- Payment Terms: required.
- Tax Rate: required.
- Carrier (Ship Using): required.
- Shipping Account Number: required.
- Each purchase order line requires:
  - Part / MPN: required.
  - Quantity: required, positive whole number.
  - Unit Price: required, positive number.
  - QC Level: required.
  - Expected Delivery Date: required, must be today or a future date, and cannot be later than two days before the Need By date.
  - CPN (Customer Part Number): required.

### PO Details — Shipping section
- Carrier: required.
- Shipping Account Number: required.

### PO Details — Billing section
- Billing Address: required.
- Payment Terms: required.
- Tax Rate: required.
- Approved: required (yes/no).

### Send Purchase Order (modal)
- Supplier: required.
- Primary Contact: required.
- Email: required, must be a valid email.
- Subject line: required.
- Message Body: required (rich text, cannot be empty).

### PO Arrival Check — Step 1: Shipment Details
- Boxes Condition: required.
- Number of Boxes: required, positive whole number.
- Weight: required, positive number.
- Weight Unit: required.

### PO Line Status Update — When moving to "Shipped" status
- Quantity Shipped: required, positive number.

### PO Line Status Update — When moving to "Arrived" status
- Quantity Arrived: required, positive number.

---

## Create Sourcing Request (SR)

- Quantity: required, positive whole number.
- Priority Level: required.
- Assigned Team: required (at least one team must be assigned, unless a buyer is assigned instead).
- Sales Person: required.
- Expires At date: optional, must be today or a future date.
- Target Unit Price: optional, must be zero or greater.

### SR Details — General Info section
- Assigned Team: required.
- Sales Person: required.

### SR Batch Update — Team and Buyers
- Either an Assigned Team or at least one Buyer must be selected. Having neither gives the error: "Buying Team or Buyers is required."

---

## Create Shipment (modal)
- Quantities for each allocated order line: all must be positive whole numbers.
- At least one line with a quantity is required.

### Shipment Details — Shipping section
- Contact: required.
- Billing Address: required (in the shipping form).

### Shipment Details — Billing section
- Billing Address: required.
- Invoice Preferred Method: required.
- If method is "Online", a website URL is required.
- Payment Terms: required.
- Tax Rate: required.

---

## Create Visit (modal)

Step 1 — Details:
- Trip: required (must belong to a trip).
- Customer Account: required.
- Visit Type: required.
- Visit Status: required.
- Visit Date: required.
- Chip1 Participants: at least one required.
- Customer Participants: at least one required.

Step 2 — Topics and Notes:
- Topics: at least one required.
- Talking Points: required.
- Pre-Visit Notes: required.

### Complete Visit (modal)
- Notes: required.
- Rating: optional.
- Topics: optional.

---

## Create Trip (modal)
- Trip Name: required.
- Trip Dates (date range): required — both start and end dates must be set.
- Participants: at least one required.
- Location: required.

---

## Create Invoice from Shipment (modal)
No required fields beyond what is pre-populated from the shipment.

---

## Create RMA (Return Merchandise Authorization)

- Shipping Address: required.
- Each line item:
  - Part: required (pre-populated from the source order line).
  - Quantity: required, positive whole number.
  - Reason: optional.
  - Resolution Type: optional.

---

## Create Offer (modal)

- Supplier: required.
- Contact (primary): required.
- Offer Type: required.
- For each offer line:
  - Part / MPN: required.
  - Quantity: optional, must be positive if entered.
  - Unit Price: required, positive number.
  - Expiration Date: defaults to 2 weeks from today.

### Request Offer from Suppliers (modal)
- Part / MPN: required.
- For each supplier being asked:
  - Supplier account: required.
  - Contact: required, and the contact must have at least one email address on file. If no email, error: "Contact email is required."
  - Quantity: optional, positive if entered.
  - Target Unit Price: optional, positive if entered.
- Notes: optional, maximum 5000 characters.

### Request Offer for Purchase (modal)
- Due Date: required.
- Approval Contact: optional.
- Note: optional, maximum 5000 characters.

---

## Create Task (modal / panel)
No strictly required fields beyond the task name based on available source code — tasks can be created as notes.

---

## Create User (Admin — modal)
- First Name: required.
- Last Name: required.
- Phone: required, must include country code and phone number.
- Email: required, must be a valid email.
- Email Confirmed: required (yes/no toggle).
- Office: required.
- Department: required.
- Manager: required.
- Role: required, at least one role must be assigned.
- Permissions: required, at least one permission must be assigned.
- Status: required.

---

## Stock — Create Stock Entry (modal)
- Part / MPN: required.
- Quantity Received: required, positive whole number.
- Other fields (date code, packaging, location, lot code) are optional.

### Stock — Reserve Quantity (modal)
- Reserved Quantity: required, must be a whole number between 0 and the available quantity.
- Reserved On date: required.
- Reserved By user: optional.

### Stock — Mark as QC Received (modal)
- QC Inspector: required (select a user).

### Stock — Complete QC (modal)
- New Status: required.

### Stock — Update Status (modal)
- New Status: required.
- If setting status to "QC Received", a QC Inspector must be selected.

---

## Quality Control Forms (Order Lines)

### Validation Process section
- Packaging result: required.
- Labels result: required.
- Device Body result: required.
- Device Leads result: required.
- Product Spec Sheet result: required.
- Dimensions result: required.
- Device Surface result: required.

### Analysis Documents section
- XRF Analysis result: required.
- Solderability result: required.
- Shield Image Analysis result: required.

### Conclusion section
- Final Result: required.

---

## Campaign — Create Campaign (modal / wizard)

Step 1 — Details:
- Campaign Name: required.
- Maximum Follow-Ups: required, number.
- Follow-Up Delay Days: required, number.
- Description, Goal, Sender Name/Email, and all other fields: optional.

Step 2 — Select Contacts:
- Contacts list: populated from search/filter; no minimum required at creation time.

---

## Common Validation Rules (applies across all forms)

- Required fields: shown with an asterisk (*) or the label "(Required)". Submitting while any required field is empty will block the form.
- Email fields: must be a properly formatted email address (e.g., name@domain.com). Error: "Invalid email."
- URL fields: must start with http:// or https://. Error: "Must be a valid URL."
- Phone fields: must include both country code and phone number. A partial phone (country code only, or number only) will show "Invalid phone."
- Number fields with a minimum of 0: cannot be negative. Error: "Must be greater than or equal to 0."
- Positive number fields: must be greater than zero. Error: "Must be a positive number."
- Whole number (integer) fields: decimals are not allowed. Error: "Must be an integer."
- Date fields that require a future date: entering a past date shows "Past dates are not allowed."
- Expected Delivery Date on PO Lines: must be at least 2 days before the Need By date. Error: "Cannot be later than two days before the need-by date."
- Password: minimum 8 characters, requires at least one uppercase letter, one number, and one symbol.
- Text fields with a character minimum: First and Last Name must be at least 2 characters; Account Name must be at least 3.
- Duplicate ID types on accounts: you cannot add two external IDs of the same type to an account.
