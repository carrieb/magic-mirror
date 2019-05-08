const USDAFoodApi = require('../src/api/usda-food-api');

USDAFoodApi.searchForFood('barilla spaghetti', (result) => {
  result.list.item.forEach((item) => {
    console.log(item);
  });
}, (error) => {
  console.error(error);
});
