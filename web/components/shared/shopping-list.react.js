import React from 'react';
import PropTypes from 'prop-types';

import IngredientsList from 'components/recipes/ingredients/ingredients-list.react';

import KitchenState from 'state/KitchenState';

import 'sass/shared/shopping-list.scss';

import _isEmpty from 'lodash/isEmpty';
import _isEqual from 'lodash/isEqual';
import _find from 'lodash/find';

import ApiWrapper from 'util/api-wrapper';

import qty from 'js-quantities';


class ShoppingList extends React.Component {
  constructor(props) {
    super(props);
    this.toggleExpansion = this.toggleExpansion.bind(this);
    this.export = this.export.bind(this);
    this.state = { expanded: false, inventory: [], shared: [] };
  }

  componentWillReceiveProps(nextProps) {
    if (!_isEmpty(nextProps.items)) {
      this.setState({ expanded: true });

      if (!_isEqual(nextProps.items, this.props.items)) {
        this.compareItemsToInventory(nextProps.items);
      }
    }
  }

  export() {
    //ApiWrapper.exportShoppingList(this.props.items);
    this.compareItemsToInventory(this.props.items);
  }

  compareItemsToInventory(items) {
    console.log('comparing...');
    const inventory = this.state.inventory;

    const shared = {};

    items.forEach((listItem) => {
      const found = _find(inventory, (inventoryItem) => inventoryItem.description.toLowerCase() === listItem.name.toLowerCase());
      if (found) {
        console.log(found);
        const inventoryQty = qty(found.quantity.amount, found.quantity.unit);
        console.log(listItem.quantity.unit);
        const listItemQty = qty(listItem.quantity.amount, listItem.quantity.unit.toLowerCase());
        console.log(inventoryQty.toString(), listItemQty.toString());
        const diff = inventoryQty.sub(listItemQty);
        console.log(diff);
        shared[listItem.name] = { found, diff };
      }
    });

    console.log(shared);
    this.setState({ shared });
  }

  componentWillMount() {
    KitchenState.getKitchen((inventory) =>  {
      this.setState({ inventory });
    });
  }

  toggleExpansion() {
    this.setState({ expanded: !this.state.expanded });
  }

  render() {
    console.log('shopping list', this.state.shared);
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

export default ShoppingList;
