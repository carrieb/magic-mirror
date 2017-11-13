import ApiWrapper from '../util/api-wrapper';
import find from 'lodash/find';

let loadedKitchen = null;

const loadKitchen = (callback) => {
  ApiWrapper.getKitchen((kitchen) => {
    loadedKitchen = kitchen;
    callback();
  });
}

const deleteFood = (id, callback) => {
  ApiWrapper.trashFood(id)
    .done(() => {
      loadedKitchen = loadedKitchen.filter((item) => item._id !== id);
      callback(loadedKitchen);
    });
}

const findFoodByName = (name) => {
  return find(loadedKitchen, (item) => item.description === name);
};

const executeWhenLoaded = (callback) => {
  if (loadedKitchen === null) {
    loadKitchen(callback);
  } else {
    callback();
  }
};

const KitchenState = {
  DEFAULT_ITEM: {
    description: 'new item',
    quantity: {
      unit: 'cup',
      amount: 1
    },
    expiration: {
      delta: 'week',
      length: 1
    },
    servingSize: {
      unit: 'cup',
      amount: 1
    },
    category: 'Leftovers',
    zone: 'Fridge',
    price: 1.00
  },

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

  trashFood(id, callback) {
    deleteFood(id, (kitchen) => {
      callback(kitchen);
    });
  },

  updateImage(foodName, imageUrl) {
    findFoodByName(foodName).img = imageUrl;
  },

  addItem(item) {
    // TODO: include API call here
    loadedKitchen.push(item);
  }
}

export default KitchenState;
