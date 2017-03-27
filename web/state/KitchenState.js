import ApiWrapper from '../util/api-wrapper';
import find from 'lodash/find';

let loadedKitchen = null;

const loadKitchen = (callback) => {
  ApiWrapper.getKitchen((kitchen) => {
    loadedKitchen = kitchen;
    callback();
  });
}

const findFoodByName = (name) => {
  return find(loadedKitchen, (item) => item.description === name);
}

const executeWhenLoaded = (callback) => {
  if (loadedKitchen === null) {
    loadKitchen(callback);
  } else {
    callback();
  }
}

const KitchenState = {
  getKitchen(callback) {
    executeWhenLoaded(() => {
      callback(loadedKitchen)
    });
  },

  findFood(foodName, callback) {
    executeWhenLoaded(() => {
      const foodItem = findFoodByName(foodName);
      callback(foodItem);
    });
  },

  updateImage(foodName, imageUrl) {
    findFoodByName(foodName).img = imageUrl;
  }
}

export default KitchenState;
