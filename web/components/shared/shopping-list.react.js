import React from 'react';
import PropTypes from 'prop-types';

import IngredientsList from 'components/recipes/ingredients/ingredients-list.react';

import { KitchenState, withKitchen } from 'state/KitchenState';
import ShoppingListState from 'state/ShoppingListState';

import 'sass/shared/shopping-list.scss';

import _isEmpty from 'lodash/isEmpty';
import _isEqual from 'lodash/isEqual';
import _find from 'lodash/find';
import _values from 'lodash/values';

import ApiWrapper from 'util/api-wrapper';

import qty from 'js-quantities';


class ShoppingList extends React.Component {
  constructor(props) {
    super(props);

    this.toggleExpansion = this.toggleExpansion.bind(this);
    this.addItem = this.addItem.bind(this);
    this.export = this.export.bind(this);

    this.state = {
      expanded: false,
      shared: []
    };
  }

  addItem(item) {
    const items = this.state.items;
    items.push(item);
    this.setState({ items, expanded: true });
    this.compareItemsToInventory();
  }

  export() {
    this.compareItemsToInventory();
    //ApiWrapper.exportShoppingList(this.props.items);
  }

  compareItemsToInventory() {
    const inventory = this.props.inventory;
    const items = this.props.items;

    const shared = {};

    items.forEach((listItem) => {
      const name = listItem.name || listItem.description;
      const found = _find(inventory, (inventoryItem) => inventoryItem.description.toLowerCase() === name.toLowerCase());
      if (found) {
        console.log(found);
        const inventoryQty = qty(found.quantity.amount, found.quantity.unit);
        console.log(listItem.quantity.unit);
        const listItemQty = qty(listItem.quantity.amount, listItem.quantity.unit.toLowerCase());
        console.log(inventoryQty.toString(), listItemQty.toString());
        const diff = inventoryQty.sub(listItemQty);
        console.log(diff);
        shared[name] = { found, diff };
      }
    });

    console.log(shared);
    this.setState({ shared });
  }

  toggleExpansion() {
    this.setState({ expanded: !this.state.expanded });
  }

  render() {
    //console.log('shopping list', this.props.items);
    return (
      <div className={`shopping-list ${this.state.expanded ? 'expanded' : ''}`}>
        <div className="ui fluid segment">
          <i className={`ui right floated ${this.state.expanded ? 'red minus' : 'green plus'} icon`}
             onClick={this.toggleExpansion}/>
          <div className="content">
            <div className="ui sub header">Shopping List</div>
            {/* ugh okay how are we gonna do this */}
            {/* i just made this beautiful class!!!!! */}
            {/* pass in another prop? like compareTo= */}
            <IngredientsList items={this.props.items}/>
            <div className="export-button">
              <button className="ui icon button" onClick={this.export}>
                <i className="ui share alternate square icon"/>
                Export
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ShoppingList.propTypes = {
  items: PropTypes.array
}

ShoppingList.defaultProps = {
  items: []
}

function withShoppingList(WrappedComponent) {
  return withKitchen(class ShoppingListContainer extends React.Component {
    constructor(props) {
      super(props);
      this.addItem = this.addItem.bind(this);
      this.state = { shoppingList: [] };
    }

    addItem(item) {
      console.log('shopping add', item);
      const shoppingList = this.state.shoppingList;
      shoppingList.push(item);
      this.setState({ shoppingList });
    }

    render() {
      return (
        <div>
          <ShoppingList items={this.state.shoppingList} inventory={_values(this.state.kitchen)}/>
          <WrappedComponent addToShoppingList={this.addItem}
                            shoppingList={this.state.shoppingList}
                            {...this.props} />
        </div>
      )
    }
  });
}

export { ShoppingList, withShoppingList };
