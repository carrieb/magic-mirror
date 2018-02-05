import ApiWrapper from 'util/api-wrapper';

import _clone from 'lodash/clone';
import _debounce from 'lodash/debounce';

import React from 'react';

let loadedItems = [];
let loadedKitchen = {};

const DEFAULT_ITEM = {
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

    console.log('kitchen state loaded', loadedItems, loadedKitchen, listeners);
    listeners.forEach((callback) => {
      callback(loadedKitchen);
    });
  },

  debouncedRequest: _debounce(() => {
    console.log('kitchen state submitting ajax request');
    ApiWrapper.getKitchen()
      .done(KitchenState.done);
  }, 5000, {
    leading: true,
    trailing: false
  }),

  getKitchen() {
    this.debouncedRequest();
  },

  addChangeListener(callback) {
    listeners.push(callback);
  },

  removeChangeListener(callback) {
    listeners = listeners.filter((cb) => {
      !Object.is(cb, callback)
    });
  }
};

function withKitchen(WrappedComponent) {
  return class extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        kitchen: loadedKitchen
      }
    }

    componentWillMount() {
      console.log('withKitchen will mount', WrappedComponent.name);
      KitchenState.addChangeListener(this.handleChange);
      KitchenState.getKitchen();
    }

    componentWillUnmount() {
      KitchenState.removeChangeListener(this.handleChange);
    }

    handleChange = (kitchen) => {
      this.setState({
        kitchen
      });
    };

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
                          kitchenIndex={loadedKitchen}
                          {...this.props}/>
      );
    }
  };
}

export { KitchenState, withKitchen, DEFAULT_ITEM };
