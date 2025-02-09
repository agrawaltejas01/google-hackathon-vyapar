const fs = require("fs");
const faker = require("@faker-js/faker").faker;
const inputPerson = "tejas";

const inputPath = `../output/${inputPerson}/final/results.json`;
const outputPath = `output/${inputPerson}/final/bank-aggregation.json`;
const loansOutputPath = `output/${inputPerson}/final/loans.json`;

const inputJson = require(inputPath);

let monthAndCategoryToExpenseAmountMap = {};
let monthToExpenseMap = {};
let monthToCreditMap = {};
let creditCardExpenses = [];
let monthToCreditCardMap = {};

function handleEmptyEntry(map, key, value) {
  if (!map[key]) map[key] = value;
  else map[key] += value;
}

function bucketize() {
  for (let bankStatements of Object.keys(inputJson)) {
    let statements = inputJson[bankStatements]["statements"];
    if (!statements || !statements.length) continue;
    for (let statement of statements) {
      let transactions = statement["transactions"];
      if (!transactions || !transactions.length) continue;

      for (let transaction of transactions) {
        let category = transaction.category;
        let date = transaction.date;

        date = date.replace(/\//g, "-");
        let month = date.split("-")[1];

        transaction.debit =
          transaction.debit && transaction.debit.replace(/,/g, "");
        transaction.credit =
          transaction.credit && transaction.credit.replace(/,/g, "");

        transaction.debit = parseInt(transaction.debit || 0);
        transaction.credit = parseInt(transaction.credit || 0);

        if (transaction.debit) {
          if (transaction.subcategory == "Credit card payments") {
            handleEmptyEntry(monthToCreditCardMap, month, transaction.debit);
          } else {
            let key = `${month}-${category}`;
            handleEmptyEntry(
              monthAndCategoryToExpenseAmountMap,
              key,
              transaction.debit
            );
            handleEmptyEntry(monthToExpenseMap, month, transaction.debit);
          }
        } else {
          handleEmptyEntry(monthToCreditMap, month, transaction.credit);
        }
      }
    }
  }

  let result = {
    categoryToExpenseAmountMap: monthAndCategoryToExpenseAmountMap,
    monthToExpenseMap,
    monthToCreditMap,
    monthToCreditCardMap,
  };

  fs.writeFileSync(outputPath, JSON.stringify(result));
}

function getLoanAmount() {
  let avgIncome = 0;
  let avgExpense = 0;
  let avgCreditExpense = 0;

  let monthToCreditMapArr = Object.keys(monthToCreditMap);
  let monthToExpenseMapArr = Object.keys(monthToExpenseMap);
  let monthToCreditCardMapArr = Object.keys(monthToCreditCardMap);

  for (key of monthToCreditMapArr) {
    avgIncome += monthToCreditMap[key];
  }
  avgIncome = avgIncome / monthToCreditMapArr.length;

  for (key of monthToExpenseMapArr) {
    avgExpense += monthToExpenseMap[key];
  }
  avgExpense = avgExpense / monthToExpenseMapArr.length;

  for (key of monthToCreditCardMapArr) {
    avgCreditExpense += monthToCreditCardMap[key];
  }
  avgCreditExpense = avgCreditExpense / monthToCreditCardMapArr.length;

  let loanAmount = (avgIncome - (avgExpense + avgCreditExpense)) * 10;
  console.log(loanAmount);
  return loanAmount;
}

bucketize();
getLoanAmount();
