import React from 'react';

import { Link } from 'react-router-dom';

import { withKitchen } from 'state/KitchenState';
import KitchenConstants from 'state/kitchen/kitchen-constants';

import KitchenItemCard from 'components/kitchen/kitchen-item-card.react';

import { ShoppingList } from 'components/shared/shopping-list.react';
import ShoppingListState from 'state/ShoppingListState';

import LocalStorageUtil from 'util/local-storage-util';

import _kebabCase from 'lodash/kebabCase';
import _isEqual from 'lodash/isEqual';

import 'sass/kitchen/inventory.scss';

const ALL_CATEGORIES = KitchenConstants.ALL_CATEGORIES;
const ALL_ZONES = KitchenConstants.ALL_ZONES;

class KitchenInventory extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedItem: null,
      layout: 'Cards',
      categories: new Set(['Dairy', 'Produce', 'Meat', 'Leftovers', 'Dry Goods']),
      zones: new Set(ALL_ZONES),
      tags: LocalStorageUtil.getKitchenTags(),
      shoppingList: ShoppingListState.getItems()
    }
  }

  delete(id) {

  }

  star(id) {
    // TODO: ..
  }

  toggleLayout() {
    this.setState({
      layout: this.state.layout === 'Cards' ? 'List' : 'Cards'
    });
  }

  onTagsChange = (tags) => {
    const split = tags.split(',');
    LocalStorageUtil.saveKitchenTags(split);
    if (!_isEqual(split, this.state.tags)) {
      console.log(split, this.state.tags);
      this.setState({ tags: split });
    }
  };

  componentDidMount() {
    $('.ui.dropdown').dropdown('set selected', this.state.tags)
    $('.ui.dropdown').dropdown({
      onChange: this.onTagsChange
    });
  }

  componentDidUpdate() {
    if (this.state.layout === 'table') {
      $('table').tablesort();
    }
  }

  render() {
    console.log('kitchen inventory render', this.props.kitchenIndex);
    let inventory = null;

    if (this.state.layout === 'Cards') {
      let itemCards = Object.keys(this.props.kitchenIndex)
        .map((key) => this.props.kitchenIndex[key])
      .filter((item) => {
        let filtered = false;
        if (item.zone && this.state.tags.indexOf(item.zone) === -1) {
          filtered = true;
        }
        if (item.category && this.state.tags.indexOf(item.category) === -1) {
          filtered = true;
        }
        return !filtered;
      })
      .map((foodItem, idx) => {
        return (
          <KitchenItemCard id={foodItem._id}
                           delete={(id) => this.delete(id)}
                           key={idx}/>
        );
      });

      inventory = (
        <div className="kitchen-inventory">
          { itemCards.length > 0 ?
            <div className="ui six doubling cards">{ itemCards }</div> :
            <div className="ui fluid card"><div className="content">Nothing in inventory.</div></div> }
        </div>
      );
    }

    if (this.state.layout === 'List') {
      const itemRows = this.state.kitchen.map((foodItem, idx) => {
        let imageUrl = foodItem.img ? `/food-images/${foodItem.img}` : '/food-images/no-image.png';
        return (
          <tr key={idx} className="food-item-row">
            <td><img src={imageUrl}/></td>
            <td>{foodItem.description}</td>
            <td>...</td>
          </tr>
        )
      });
      inventory = (
        <table className="ui sortable unstackable table">
          <thead>
            <tr>
              <th></th>
              <th>Name </th>
              <th></th>
            </tr>
          </thead>
            <tbody>
            { itemRows }
            </tbody>
          <tfoot>
            <tr>
              <th>{this.state.kitchen.length} Items</th>
            </tr>
          </tfoot>
        </table>
      );
    }
    const item = (name) => <div key={name} className="item" data-value={name}>
      <img src={`/images/kitchen/${_kebabCase(name.toLowerCase())}.png`}/>
      {name}
    </div>;

    const layoutClassName = (layout) => `ui ${this.state.layout === layout ? 'disabled active' : ''} vertical animated icon button`;
    return (
      <div className="kitchen-inventory">
        <ShoppingList items={this.state.shoppingList} />
        <div className="inventory-wrapper">
        <div className="header">
          <div className="tags-wrapper">
            <div className="ui fluid multiple search selection dropdown">
              <input type="hidden" name="tags"/>
              <i className="dropdown icon"/>
              <div className="default text">Select Tags</div>
                <div className="menu">
                  { ALL_ZONES.map(item) }
                  { ALL_CATEGORIES.map(item) }
                </div>
            </div>
          </div>

          <div className="ui basic fluid buttons">
            <div className={layoutClassName('Cards')} tabIndex="0" onClick={(ev) => this.toggleLayout(ev)}>
              <div className="hidden content">Cards</div>
              <div className="visible content">
                <i className="grid layout icon"/>
              </div>
            </div>
            <div className={layoutClassName('List')} tabIndex="0" onClick={(ev) => this.toggleLayout(ev)}>
              <div className="hidden content">List</div>
              <div className="visible content">
                <i className="list layout icon"/>
              </div>
            </div>
          </div>

        </div>
        <div className="content">
          { inventory }
        </div>
        </div>
        <div className="footer">
          <Link to="/kitchen/item/new">
            <button className="ui large purple button">Add Item</button>
          </Link>
        </div>
      </div>
    );
  }
}

export default withKitchen(KitchenInventory);
