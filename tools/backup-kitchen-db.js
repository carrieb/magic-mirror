const FoodDb = require('../src/food-db');
const fs = require('fs');
const mkdirp = require('mkdirp');
const moment = require('moment');

const OUT_DIR = 'out/';

FoodDb.getKitchen((kitchen) => {
  const now = moment();
  const dirname = OUT_DIR + now.format('YYYY-MM-DD') + '/';
  const filename = dirname + 'kitchen.json';

  mkdirp(dirname, (err) => {
    if (err) {
      console.error(err);
      return;
    }

    kitchen.forEach((item) => {
      delete item._id;
    });

    fs.writeFile(filename, JSON.stringify(kitchen), () => {
      process.exit();
    })
  });
  console.log(`Backing up ${kitchen.length} items to ${filename}.`);
  return;
}, (error) => {
  console.error(error);
});