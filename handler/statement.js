const fs = require("fs");
const path = require("path");
const bankAggregator = require("./../credit-processor/bank-aggregator");

function getUserNames(req, res) {
  const outputFolderPath = path.join(__dirname, "..", "output"); // Adjust the path to go up one directory level
  fs.readdir(outputFolderPath, { withFileTypes: true }, (err, files) => {
    if (err) {
      res.status(500).json({ error: "Failed to read directory" });
      return;
    }

    const users = files
      .filter((dirent) => dirent.isDirectory())
      .map((dirent, index) => ({ id: index, username: dirent.name }));

    res.json({ users });
  });
}

function getUserData(req, res) {
  const username = req.params.username; // Get username from URL parameter
  console.log("username", username);
  const outputFolderPath = path.join(
    __dirname,
    "..",
    "output",
    username,
    "final",
    "results.json"
  );

  fs.readFile(outputFolderPath, "utf8", (err, data) => {
    if (err) {
      res.status(500).json({ error: "Failed to read file" });
      return;
    }

    // Parse JSON data
    let jsonData;
    try {
      jsonData = JSON.parse(data);
    } catch (parseErr) {
      res.status(500).json({ error: "Failed to parse JSON data" });
      return;
    }

    let report;

    // Process all banks in the JSON file
    const results = [];
    for (const bank in jsonData) {
      console.log("Bank", bank);

      const bankData = jsonData[bank];
      console.log("bankData", bankData);
      if (bankData) {
        const formattedResponse = {
          bank: bankData?.account?.account_details?.bank_name || "",
          name: bankData?.account?.account_holder?.name || "",
          account_number:
            bankData?.account?.account_details?.account_number || "",
          ifsc_code: bankData?.account.account_details?.ifsc_code || "",
          micr_code: bankData?.account.account_details?.micr_code || "",
          pan: bankData?.account?.account_details?.pan || "",
          spend: getSpendByCategory(bankData.statements),
          loanAmount: bankAggregator.getLoanAmount(jsonData),
          statement_period: bankData?.account?.statement_period
            ? {
                from: bankData?.account?.statement_period?.from,
                to: bankData?.account?.statement_period?.to
              }
            : undefined
        };
        results.push(formattedResponse);
      }
    }
    if (results.length > 0) {
      res.json(results);
    } else {
      res.status(404).json({ error: "No bank data found" });
    }
  });
}

function getSpendByCategory(statements) {
  if (!statements) {
    console.error("No statements provided");
    return {};
  }

  const categorySpend = {};

  statements.forEach((statement) => {
    if (!statement.transactions) return;

    statement.transactions.forEach((transaction) => {
      const { category, subcategory, debit } = transaction;

      if (!debit || typeof debit !== "string") return;

      const amount = parseFloat(debit.replace(/,/g, ""));
      if (isNaN(amount)) return; // Skip if amount is not a number

      if (!categorySpend[category]) {
        categorySpend[category] = { total: 0, subcategories: {} };
      }
      categorySpend[category].total += amount;

      if (!categorySpend[category].subcategories[subcategory]) {
        categorySpend[category].subcategories[subcategory] = 0;
      }
      categorySpend[category].subcategories[subcategory] += amount;
    });
  });

  return categorySpend;
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports = { getUserNames, getUserData };
