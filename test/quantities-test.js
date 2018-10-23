const Quantities = require('../src/common/quantities');
const chalk = require('chalk');

const _isEqual = require('lodash/isEqual');

const parseAmount_testCases = [
  { input: '1', expected: 1 },
  { input: '1/2', expected: 0.5 },
  { input: '1 1/2', expected: 1.5 },
  { input: '1.5', expected: 1.5 },
  { input: '½', expected: 0.5 },
  { input: '⅓', expected: 1.0/3.0 },
  { input: '¼', expected: 0.25 },
  { input: '2 ¼', expected: 2.25 }
]

parseAmount_testCases.forEach((testCase) => {
  const val = Quantities.parseAmount(testCase.input);
  if (val === testCase.expected) {
    console.log(chalk.green(`Test passed. Expected: ${testCase.expected}. Actual: ${val}`));
  } else {
    console.error(chalk.red(`Test failed. Expected: ${testCase.expected}. Actual: ${val}`));
  }
});

const parseQuantity_testCases = [
  { input: '1', expected: { unit: null, amount: 1, rest: '' } },
  { input: '1 tablespoon', expected: { unit: 'tablespoon', amount: 1, rest: '' } },
  { input: '1 tablespoon vanilla extract', expected: { unit: 'tablespoon', amount: 1, rest: 'vanilla extract' } }
];

parseQuantity_testCases.forEach((testCase) => {
  const val = Quantities.parseQuantity(testCase.input);
  if (_isEqual(val, testCase.expected)) {
    console.log(chalk.green(`Test passed. Expected: ${JSON.stringify(testCase.expected)}. Actual: ${JSON.stringify(val)}`));
  } else {
    console.error(chalk.red(`Test failed. Expected: ${JSON.stringify(testCase.expected)}. Actual: ${JSON.stringify(val)}`));
  }
});
