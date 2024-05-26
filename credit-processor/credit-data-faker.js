import { faker } from "@faker-js/faker";

let randomExpense = (minK, maxK) =>
  faker.finance.amount({
    min: parseInt(`${minK}000`),
    max: parseInt(`${maxK}000`),
  });

function fakeCreditData() {
  let credit = [];

  for (let i = 0; i < 12; i++) {
    credit.push(randomExpense(10, 30));
  }
}



fakeCreditData();
