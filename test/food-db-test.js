const FoodDb = require('../src/food-db');

FoodDb.storeNewItems([{
  description: "cheerios",
  price: 1.11
}, {
  description: "milk",
  price: 2.22
}, {
  description: "cheerios",
  price: 3.33
}], (res) => console.log('Success!', res), (err) => console.log('Error. :(', err));
