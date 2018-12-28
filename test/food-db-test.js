const initDbs = require('../src/dbs')
const FoodDb = require('../src/dbs/food-db');

initDbs().then(dbs => {
  FoodDb.getKitchen(dbs,
    (kitchen) => kitchen.forEach(i => console.log(i.description)), 
    (err) => console.error('err'));
}).catch(err => {
  console.error(err);
});


// FoodDb.storeNewItems([{
//   description: "cheerios",
//   price: 1.11
// }, {
//   description: "milk",
//   price: 2.22
// }, {
//   description: "cheerios",
//   price: 3.33
// }], (res) => console.log('Success!', res), (err) => console.log('Error. :(', err));
