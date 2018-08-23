import React from 'react';

import { Link } from 'react-router-dom';

import { withKitchen } from 'state/KitchenState';
import KitchenConstants from 'state/kitchen/kitchen-constants';

import KitchenItemCard from 'components/kitchen/kitchen-item-card.react';
import CardLayout from 'components/kitchen/card-layout.react';
import ListLayout from 'components/kitchen/list-layout.react';
import ImageOption from 'components/kitchen/image-option.react';

import { ShoppingList } from 'components/shared/shopping-list.react';
import ShoppingListState from 'state/ShoppingListState';

import LocalStorageUtil from 'util/local-storage-util';

import SearchItemsByNameDropdown from 'components/kitchen/search-items-by-name-dropdown.react';
import Dropdown from 'components/common/dropdown.react';

import _kebabCase from 'lodash/kebabCase';
import _isEqual from 'lodash/isEqual';
import _clone from 'lodash/clone';
import _values from 'lodash/values';

import 'sass/kitchen/inventory.scss';

const ALL_CATEGORIES = KitchenConstants.ALL_CATEGORIES;
const ALL_ZONES = KitchenConstants.ALL_ZONES;

class KitchenInventory extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedItem: null,
      layout: 'Cards',
      categories: LocalStorageUtil.getInventoryFilterCategories() || _clone(ALL_CATEGORIES),
      zones: LocalStorageUtil.getInventoryFilterZones() || _clone(ALL_ZONES),
      shoppingList: [], // todo: remove? should be all encapsulated in withShoppingList HOC
      includeOutOfStock: false,
      groupByCategory: false
    }
  }

  componentDidUpdate() {
    if (this.state.layout === 'table') {
      $('table').tablesort();
    }

    //console.log(localStorage.getItem('scroll'))
  }

  componentWillUnmount() {
    localStorage.setItem('scroll:', window.scrollY);
  }

  toggleLayout = () => {
    this.setState({
      layout: this.state.layout === 'Cards' ? 'List' : 'Cards'
    });
  };

  onZonesChange = (raw) => {
    const zones = raw.split(',');
    LocalStorageUtil.saveInventoryFilterZones(zones);
    if (!_isEqual(zones, this.state.zones)) {
      console.log(zones, this.state.zones);
      this.setState({ zones });
    }
  }

  onCategoriesChange = (raw) => {
    const categories = raw.split(',');
    console.log(categories);
    LocalStorageUtil.saveInventoryFilterCategories(categories);
    if (!_isEqual(categories, this.state.categories)) {
      console.log(categories, this.state.categories);
      this.setState({ categories });
    }
  }

  filteredItems = () => {
    return _values(this.props.kitchenIndex)
    .filter((item) => {
      let filtered = false;
      if (item.zone && this.state.zones.indexOf(item.zone) === -1) {
        filtered = true;
      }
      if (item.category && this.state.categories.indexOf(item.category) === -1) {
        filtered = true;
      }
      if (!this.state.includeOutOfStock && item.quantity.amount === 0) {
        filtered = true;
      }
      return !filtered;
    })
  }

  render() {
    console.log('kitchen inventory render', this.state, Object.keys(this.props.kitchenIndex).length);
    let inventory = null;

    if (this.state.layout === 'Cards') {
      // TODO: move this to be rendered in the card layout?
      const cards = this.filteredItems()
      .map((foodItem, idx) => {
        return (
          <KitchenItemCard id={foodItem._id || 'fake id'}
                           delete={(id) => this.delete(id)}
                           key={idx}/>
        );
      });

      inventory = <CardLayout grouped={this.state.groupByCategory}>{ cards }</CardLayout>;
    }

    if (this.state.layout === 'List') {
      const rows = this.state.kitchen.map((foodItem, idx) => {
        let imageUrl = foodItem.img ? `/food-images/${foodItem.img}` : '/food-images/no-image.png';
        return (
          <tr key={idx} className="food-item-row">
            <td><img src={imageUrl}/></td>
            <td>{foodItem.description}</td>
            <td>...</td>
          </tr>
        )
      });

      inventory = <ListLayout>{ rows }</ListLayout>;
    }

    const imageOption = (name) => <ImageOption key={name} name={name}/>;

    const layoutClassName = (layout) => `ui ${this.state.layout === layout ? 'disabled active' : ''} vertical animated icon button`;
    return (
      <div className="kitchen-inventory">
        <ShoppingList items={this.state.shoppingList} />
        <div className="inventory-wrapper">
        <div className="header">
          <SearchItemsByNameDropdown/>
          <Dropdown className="ui fluid multiple search selection dropdown categories"
                    options={{ onChange: this.onCategoriesChange }}
                    value={this.state.categories}>
              { ALL_CATEGORIES.map(imageOption) }
          </Dropdown>
          <Dropdown className="ui fluid multiple search selection dropdown zones"
                    options={{ onChange: this.onZonesChange }}
                    value={this.state.zones}>
              { ALL_ZONES.map(imageOption) }
          </Dropdown>

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

          <div className="ui toggle checkbox">
            <input type="checkbox"
                   name="public"
                   checked={this.state.includeOutOfStock}
                   onClick={ () => this.setState({ includeOutOfStock: !this.state.includeOutOfStock })}/>
            <label>Include out of stock items</label>
          </div>

          <div className="ui fluid toggle checkbox">
            <input type="checkbox"
                   name="public"
                   checked={this.state.groupByCategory}
                   onClick={ () => this.setState({ groupByCategory: !this.state.groupByCategory })}/>
            <label>Group by category</label>
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
