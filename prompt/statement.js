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

const promptTemplateALLPage = `Given the text of a bank statement provided as {bank_statement_text} , extract transactional information according to the following instructions. Use the categories and subcategories provided to classify each transaction. 
Each subcategory is followed by its weight and a true/false. Add the same weight and true/false fields int the json response.
Ensure accurate and detailed data extraction for each transaction to populate the JSON structure effectively.

Categories and Subcategories:
- Housing and Utilities
  - Rent or mortgage 0.05 false
  - Electricity bill 0.02 false
  - Water bill 0.01 false
  - Gas bill 0.01 false
  - Internet bill 0.01 false
  - Phone bill 0.03 false
- Transportation
  - Fuel 0.04 false
  - Public transport 0.03 false
  - Vehicle maintenance 0.02 false
  - Vehicle insurance 0.01 false
- Food and Groceries
  - Groceries 0.1 false
  - Dining out 0.03 true 
  - Food delivery 0.02 true
- Healthcare
  - Medical bills 0.05 false
  - Pharmacy 0.03 false
  - Health insurance 0.02 false
- Debt Repayment
  - Credit card payments 0.05 false 
  - Loan payments 0.04 false
  - Other debt-related expenses 0.01 false
- Savings and Investments
  - Savings account deposits 0.06 false
  - Investment contributions 0.04 false
- Insurance
  - Life insurance 0.02 false
  - Home insurance 0.02 false
  - Other insurance premiums 0.01 false
- Entertainment and Leisure
  - Subscriptions 0.05
  - Event tickets 0.03
  - Hobbies and sports 0.01
- Education
  - Tuition fees 0.03 false
  - School supplies 0.01 false
  - Courses and workshops 0.01 false
- Shopping
  - Clothing and accessories 0.05 true
  - Electronics 0.03 true
  - Home furnishings 0.02 true
- Miscellaneous
  - Gifts and donations 0.03 true
  - Pet expenses 0.01 true
  - Legal fees 0.01 true
- Income
  - Salary 0.03 false
  - Business income 0.01 false
  - Other income sources 0.01 false

General Extraction Instructions for Each Transaction:
- Date: Extract the date in DD-MM-YYYY format.
- Cheque Number: Extract the cheque number if applicable; if not, indicate as null.
- Particulars: Extract any particulars related to the transaction.
- Payment Method: Identify the payment method (UPI, CARD, Cheque, Particular, Autopayment, Other, Debt). If payment method is unidentifiable, mark as 'needs to be checked'
- Debit and Credit: Extract the debit and credit amounts; if none, leave blank.
- Balance: Extract the balance amount after the transaction.
- Category and Subcategory: Categorize the transaction based on the particulars, using the specified list.
- Weight and isDiscretionary: You will get this from the categorising. This is provided in the categories and subcategories map.
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
      "weight": "<Weight>",
      "isDiscretionary": "<isDiscretionary>",
      "recipientName":  "<Recipient Name>"
    }}
  ]
}}

Apply these instructions meticulously to ensure accurate and complete information extraction and classification. If certain details are missing, indicate them as 'null' or leave blank as instructed. Classify each transaction according to the closest matching category and subcategory from the provided list."
`;

module.exports = { promptTemplateHomePage, promptTemplateALLPage };
