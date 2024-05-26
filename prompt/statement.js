const promptTemplateHomePage = `Given the text of a bank statement provided as {bank_statement_text}, use the instructions below to extract key information and organize it into the following JSON format:

Extraction Guidelines:
- Extract names (account holder, joint holder, nominee) directly from the text.
- Address components (street, village, city, state, country, postal code) should be extracted from the address section.
- Account details such as customer ID, account number, IFSC, MICR, scheme, and CKYC should be directly extracted from relevant sections.
- Contact details should be retrieved from designated contact sections of the statement.
- Statement period should be specifically noted for start and end dates in DD-MM-YYYY format.
- Nominee information should include registration status and name, when available.

JSON Structure:
{{
  "account_holder": {{
    "name": "<Account Holder's Name>",
    "joint_holder": "<Joint Holder's Name, if mentioned>",
    "father_name": "<Father's Name>",
    "address": {{
      "street": "<Street>",
      "village": "<Village>",
      "city": "<City>",
      "state": "<State>",
      "country": "<Country>",
      "postal_code": "<Postal Code>"
    }}
  }},
  "account_details": {{
    "customer_id": "<Customer ID>",
    "account_number": "<Account Number>",
    "ifsc_code": "<IFSC Code>",
    "micr_code": "<MICR Code>",
    "scheme": "<Account Scheme>",
    "nominee": {{
      "registered": "<Nominee Registration Status>",
      "name": "<Nominee's Name>"
    }},
    branch_name:<Branch Name>,
    bank_name:<Bank Name>
    "pan": "<PAN Number>",
    "ckyc_number": "<CKYC Number>"
  }},
  "contact_details": {{
    "mobile_number": "<Mobile Number>",
    "email": "<Email Address>"
  }},
  "statement_period": {{
    "from": "<Start Date>",
    "to": "<End Date>"
  }}
}}

Follow these guidelines to ensure accurate data extraction and placement within the JSON structure. Handle missing information by indicating 'null' or leaving the field blank. Verify the extracted data for accuracy and to avoid duplication."
`;

const promptTemplateALLPage = `Given the text of a bank statement provided as {bank_statement_text} , extract transactional information according to the following instructions. Use the categories and subcategories provided to classify each transaction. Ensure accurate and detailed data extraction for each transaction to populate the JSON structure effectively.

Categories and Subcategories:
- Housing and Utilities
  - Rent or mortgage
  - Electricity bill
  - Water bill
  - Gas bill
  - Internet bill
  - Phone bill
- Transportation
  - Fuel
  - Public transport
  - Vehicle maintenance
  - Vehicle insurance
- Food and Groceries
  - Groceries
  - Dining out
  - Food delivery
- Healthcare
  - Medical bills
  - Pharmacy
  - Health insurance
- Debt Repayment
  - Credit card payments
  - Loan payments
  - Other debt-related expenses
- Savings and Investments
  - Savings account deposits
  - Investment contributions
- Insurance
  - Life insurance
  - Home insurance
  - Other insurance premiums
- Entertainment and Leisure
  - Subscriptions
  - Event tickets
  - Hobbies and sports
- Education
  - Tuition fees
  - School supplies
  - Courses and workshops
- Shopping
  - Clothing and accessories
  - Electronics
  - Home furnishings
- Miscellaneous
  - Gifts and donations
  - Pet expenses
  - Legal fees
- Income
  - Salary
  - Business income
  - Other income sources

General Extraction Instructions for Each Transaction:
- Date: Extract the date in DD-MM-YYYY format.
- Cheque Number: Extract the cheque number if applicable; if not, indicate as null.
- Particulars: Extract any particulars related to the transaction.
- Payment Method: Identify the payment method (UPI, CARD, Cheque, Particular, Autopayment, Other, Debt). If payment method is unidentifiable, mark as 'needs to be checked'
- Debit and Credit: Extract the debit and credit amounts; if none, leave blank.
- Balance: Extract the balance amount after the transaction.
- Category and Subcategory: Categorize the transaction based on the particulars, using the specified list.
- Recipient Information: Extract the recipient’s name if mentioned. Mark 'needs to be checked' otherwise

JSON Structure:
{{
  "transactions": [
    {{
      "date": "<Date>",
      "cheque_number": "<Cheque Number>",
      "particulars": "<Particulars>",
      "payment_method": "<Payment Method>",
      "debit": "<Debit>",
      "credit": "<Credit>",
      "balance": "<Balance>",
      "category": "<Category>",
      "subcategory": "<Subcategory>",
      "recipientName":  "<Recipient Name>"
    }}
  ]
}}

Apply these instructions meticulously to ensure accurate and complete information extraction and classification. If certain details are missing, indicate them as 'null' or leave blank as instructed. Classify each transaction according to the closest matching category and subcategory from the provided list."
`;

module.exports = { promptTemplateHomePage, promptTemplateALLPage };
