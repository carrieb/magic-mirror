import ApiWrapper from '../util/api-wrapper';
import _find from 'lodash/find';

import _kebabCase from 'lodash/kebabCase';
import _clone from 'lodash/clone';

import React from 'react';

let loadedKitchen = null;
let kitchenRequest = null;

const findFoodByName = (name) => {
  return _find(loadedKitchen, (item) => _kebabCase(item.description) === _kebabCase(name));
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
    category: 'Dry Goods',
    zone: 'Pantry',
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

function withKitchen(WrappedComponent) {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.addItem = this.addItem.bind(this);
      this.star = this.star.bind(this);

      this.state = {
        kitchen: {}
      }
    }

    componentWillMount() {
      console.log('mounting', WrappedComponent.name, loadedKitchen === null, kitchenRequest === null);
      if (loadedKitchen === null && kitchenRequest === null) {
        kitchenRequest = ApiWrapper.getKitchen()
          .done((items) => {
            console.log('done', WrappedComponent.name, items)
            loadedKitchen = items;
            // TODO: build index
            const kitchen = {};
            items.forEach((item) => {
              kitchen[item._id] = item;
            });
            this.setState({
              kitchen
            });
          });
      } else if (loadedKitchen === null) {
        console.log(WrappedComponent.name, kitchenRequest);
        kitchenRequest.done((items) => {
          // TODO: build index
          console.log('done - existing request', WrappedComponent.name, items)
          const kitchen = {};
          items.forEach((item) => {
            kitchen[item._id] = item;
          });
          this.setState({
            kitchen
          });
        });
      } else {
        //console.log('already loaded', WrappedComponent.name, loadedKitchen)
        const items = loadedKitchen;
        // TODO: build index
        const kitchen = {};
        items.forEach((item) => {
          kitchen[item._id] = item;
        });
        this.setState({
          kitchen
        });
      }
    }

    addItem(item) {
      const kitchen = _clone(this.state.kitchen);
      kitchen[item._id] = item;
      this.setState(kitchen);
    }

    star(id, starred=true) {
      return () => {
        const kitchen = _clone(this.state.kitchen);
        const item = kitchen[id];
        item.starred = starred;
        kitchen[id] = item;
        this.setState({ kitchen });
      }
    }

    render() {
      return (
        <WrappedComponent addItem={this.addItem}
                          star={this.star}
                          kitchenIndex={this.state.kitchen}
                          {...this.props}/>
      );
    }
  };
}

export { KitchenState, withKitchen };
