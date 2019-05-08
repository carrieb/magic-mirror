import ApiWrapper from 'util/api-wrapper';

import _clone from 'lodash/clone';
import _debounce from 'lodash/debounce';

import React from 'react';

let loadedItems = [];
let loadedKitchen = {};

const DEFAULT_ITEM = {
  description: 'default new item',
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
};

let listeners = [];

const KitchenState = {
  done: (items) => {
    loadedItems = items;

    const kitchen = {};
    items.forEach((item) => {
      kitchen[item._id] = item;
    });
    loadedKitchen = kitchen;

    console.log(`kitchen state loaded. ${loadedItems.length} items. alerting ${listeners.length} listeners.`);

    //console.log('kitchen state loaded', loadedItems, loadedKitchen, listeners);
    KitchenState.alertListeners();
  },

  debouncedRequest: _debounce(() => {
    //console.log('kitchen state submitting ajax request');
    ApiWrapper.getKitchen()
      .done(KitchenState.done);
  }, 5000, {
    leading: true,
    trailing: false
  }),

  getKitchen() {
    this.debouncedRequest();
  },

  star(id, starred) {
    const item = loadedKitchen[id];
    item.starred = starred;
    loadedKitchen[id] = item;
    this.alertListeners();
  },

  addChangeListener(callback) {
    listeners.push(callback);
  },

  removeChangeListener(callback) {
    listeners = listeners.filter((cb) => {
      !Object.is(cb, callback)
    });
  },

  alertListeners() {
    listeners.forEach((callback) => {
      callback(loadedKitchen, loadedItems);
    });
  }
};

function withKitchen(WrappedComponent) {
  return class extends React.Component {
    constructor(props) {
      super(props);

      KitchenState.addChangeListener(this.handleChange);
      KitchenState.getKitchen();

      this.state = {
        items: loadedItems,
        kitchen: loadedKitchen
      }
    }

    componentWillUnmount() {
      KitchenState.removeChangeListener(this.handleChange);
    }

    handleChange = (kitchen, items) => {
      this.setState({
        kitchen,
        items
      });
    };

    addItem = (item) => {
      const kitchen = _clone(this.state.kitchen);
      kitchen[item._id] = item;
      this.setState(kitchen);
    }

    updateItem = (id, item) => {
      console.log(id, item);
      const kitchen = _clone(this.state.kitchen);
      kitchen[id] = item;
      this.setState(kitchen);
    }

    star = (id, starred) => {
      return ApiWrapper.star(id, starred)
        .done(() => {
          const kitchen = _clone(this.state.kitchen);
          kitchen[id].starred = starred;
          this.setState(kitchen);
        });
    };

    render() {
      return (
        <WrappedComponent addItem={this.addItem}
                          updateItem={this.updateItem}
                          star={this.star}
                          kitchen={this.state.items}
                          kitchenIndex={this.state.kitchen}
                          {...this.props}/>
      );
    }
  };
}

export { KitchenState, withKitchen, DEFAULT_ITEM };
