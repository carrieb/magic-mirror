import React from 'react';

import { Link } from 'react-router-dom';

import { withKitchen } from 'state/KitchenState';
import KitchenConstants from 'state/kitchen/kitchen-constants';

import FixedFooter from 'components/common/fixed-footer.react';

import CardLayout from 'components/kitchen/card-layout.react';
import ListLayout from 'components/kitchen/list-layout.react';
import ImageOption from 'components/kitchen/image-option.react';

import LocalStorageUtil from 'util/local-storage-util';

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
      includeOutOfStock: false,
      groupByCategory: true,
      expandFilters: false,
      expandOptions: false,
      categorize: false
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

  toggleFilterExpansion = () => {
    this.setState({ expandFilters: !this.state.expandFilters });
  }

  toggleOptions = () => {
    this.setState({ expandOptions: !this.state.expandOptions });
  }

  onZonesChange = (raw) => {
    const zones = raw.split(',');
    console.log(raw);
    LocalStorageUtil.saveInventoryFilterZones(zones);
    if (!_isEqual(zones, this.state.zones)) {
      this.setState({ zones });
    }
  }

  onCategoriesChange = (raw) => {
    const categories = raw.split(',');
    console.log(raw);
    LocalStorageUtil.saveInventoryFilterCategories(categories);
    if (!_isEqual(categories, this.state.categories)) {
      console.log(categories);
      this.setState({ categories });
    }
  }

  addAllFilters = () => {
    this.setState({
      categories: _clone(ALL_CATEGORIES),
      zones: _clone(ALL_ZONES)
    });
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
    const filteredItems = this.filteredItems();

    if (this.state.layout === 'Cards') {
      inventory = <CardLayout items={filteredItems} categorize={this.state.groupByCategory}/>;
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

    const filters = [
      <Dropdown className="ui fluid multiple search selection dropdown categories"
                options={{ onChange: this.onCategoriesChange, className: { label: 'ui basic label' } }}
                key="categories"
                value={this.state.categories}>
          { ALL_CATEGORIES.map(imageOption) }
      </Dropdown>,
      <Dropdown className="ui fluid multiple search selection dropdown zones"
                options={{ onChange: this.onZonesChange, className: { label: 'ui basic label' }  }}
                key="zones"
                value={this.state.zones}>
          { ALL_ZONES.map(imageOption) }
      </Dropdown>,
      <button className="ui fluid basic green button" onClick={this.addAllFilters}>
        Show Me Everything
      </button>
    ];

    const layoutClassName = (layout) => `ui ${this.state.layout === layout ? 'disabled active' : ''} vertical animated icon button`;
    const options = (
      <div>
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
    );

    return (
      <div className="kitchen-inventory">
        <div className="inventory-wrapper">
        <div className="header">
          <div className="ui fluid basic icon buttons">
            <button className="ui button expand-filters-button"
                                                   onClick={this.toggleFilterExpansion}>
              <i className="filter icon"/>
              { this.state.expandFilters ? 'Close Filters' : 'Expand Filters' }
            </button>
            <button className="ui button expand-options-button"
                                                   onClick={this.toggleOptions}>
              <i className="sliders horizontal icon"/>
              { this.state.expandOptions ? 'Close Options' : 'Expand Options' }
            </button>
          </div>
          { this.state.expandFilters && filters }
          { this.state.expandOptions && options }
        </div>
        <div className="content">
          { inventory }
        </div>
        </div>
        <FixedFooter>
          <Link to="/kitchen/item/new">
            <button className="ui large purple button">Add Item</button>
          </Link>
        </FixedFooter>
      </div>
    );
  }
}

export default withKitchen(KitchenInventory);
