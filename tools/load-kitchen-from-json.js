const FoodDb = require('../src/food-db');
const fs = require('fs');

const JSON_FILE = 'out/2018-02-04/kitchen.json';

fs.readFile(JSON_FILE, (error, data) => {
  if (error) {
    console.error(err);
    process.exit(-1);
  } else {
    const kitchen = JSON.parse(data);
    FoodDb.storeNewItems(kitchen, (res) => {
      console.log(res);
      process.exit(1)
    }, () => {
      process.exit(-1);
    });
  }
});