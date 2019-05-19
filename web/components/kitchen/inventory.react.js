import React from 'react';

import { Link } from 'react-router-dom';

import { withKitchen } from 'state/KitchenState';
import { ALL_ZONES, ALL_CATEGORIES, ALL_ITEM_FIELDS } from 'state/kitchen/kitchen-constants';

import FixedFooter from 'components/common/fixed-footer.react';

import CardLayout from 'components/kitchen/card-layout.react';
import TableLayout from 'components/kitchen/table-layout.react';
import ImageOption from 'components/kitchen/image-option.react';

import AddModal from 'components/shared/add-modal.react';

import LocalStorageUtil from 'util/local-storage-util';

import Dropdown from 'components/common/dropdown.react';

import { filterItems } from 'util/kitchen-util';

import { tr } from 'util/translation-util';

import _kebabCase from 'lodash/kebabCase';
import _isEqual from 'lodash/isEqual';
import _clone from 'lodash/clone';
import _values from 'lodash/values';
import _concat from 'lodash/concat';
import _pull from 'lodash/pull';

import 'sass/kitchen/inventory.scss';

class KitchenInventory extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showAddModal: false,
      selectedItem: null,
      layout: 'List',
      fields: ['name', 'category', 'quantity', 'expiration', 'usda ndbno'],
      categories: LocalStorageUtil.getInventoryFilterCategories() || _clone(ALL_CATEGORIES),
      zones: LocalStorageUtil.getInventoryFilterZones() || _clone(ALL_ZONES),
      includeOutOfStock: false,
      groupByCategory: LocalStorageUtil.getFieldForComponent('KitchenInventory', 'groupByCategory') || false,
      groupByZone: LocalStorageUtil.getFieldForComponent('KitchenInventory', 'groupByZone') || false,
      expandFilters: false,
      expandOptions: false,
      categorize: false
    }
  }

  componentWillUnmount() {
    localStorage.setItem('scroll:', window.scrollY);
  }

  toggleLayout = (layout) => {
    if (this.state.layout !== layout) {
      this.setState({
        layout
      });
    }
  };

  toggleFilterExpansion = () => {
    this.setState({ expandFilters: !this.state.expandFilters });
  }

  toggleOptions = () => {
    this.setState({ expandOptions: !this.state.expandOptions });
  }

  onZonesChange = (raw) => {
    const zones = raw.split(',');
    //console.log(raw);
    LocalStorageUtil.saveInventoryFilterZones(zones);
    this.setState({ zones });
  }

  onCategoriesChange = (raw) => {
    const categories = raw.split(',');
    //console.log(raw);
    LocalStorageUtil.saveInventoryFilterCategories(categories);
    this.setState({ categories });
  }

  addAllFilters = () => {
    this.setState({
      categories: _clone(ALL_CATEGORIES),
      zones: _clone(ALL_ZONES)
    });
  }

  render() {
    console.log('kitchen inventory render', this.state, Object.keys(this.props.kitchenIndex).length);
    //console.log(this.state.categories, this.state.zones);
    let inventory = null;
    const filteredItems = filterItems(this.props.kitchen, this.state);

    if (this.state.layout === 'Cards') {
      inventory = <CardLayout items={filteredItems}
                              categorize={this.state.groupByCategory}
                              zone={this.state.groupByZone}/>;
    }

    if (this.state.layout === 'List') {
      inventory = <TableLayout items={filteredItems}
                               categorize={this.state.groupByCategory}
                               zone={this.state.groupByZone}
                               fields={this.state.fields}/>;
    }

    const imageOption = (type, isSelected) => {
      return (name) => <ImageOption key={name} name={name} type={type} selected={isSelected(name)}/>;
    }

    const categorySearchFilter = <Dropdown className="fluid multiple search selection categories"
              options={{ onChange: this.onCategoriesChange, className: { label: 'ui basic label' } }}
              key="categories"
              value={this.state.categories}>
        { ALL_CATEGORIES.map(
            imageOption('ingredients.categories',
              (name) => this.state.categories.indexOf(name) >= -1)) }
    </Dropdown>;

    const zoneSearchFilter = <Dropdown className="fluid multiple search selection zones"
              options={{ onChange: this.onZonesChange, className: { label: 'ui basic label' }  }}
              key="zones"
              value={this.state.zones}>
        { ALL_ZONES.map(
            imageOption('inventory.zones',
              (name) => this.state.zones.indexOf(name) >= -1)) }
    </Dropdown>;

    const filters = <div className="inventory-filters-wrapper">
       { categorySearchFilter }
       { zoneSearchFilter }
      <button className="ui fluid basic green button" onClick={this.addAllFilters}>
        { tr('inventory.cta.Show Me Everything') }
      </button>
    </div>;

    const fieldCheckboxes = ALL_ITEM_FIELDS.map((field) => {
      return <div className="field" key={field}>
        <div className="ui checkbox">
          <input type="checkbox"
                 name="columns"
                 checked={ this.state.fields.indexOf(field) > -1 }
                 onClick={ (ev) => { if (ev.target.checked) { this.setState({ fields: _concat(this.state.fields, field) }); } else { this.setState({ fields: _pull(this.state.fields, field) }); } }}/>
          <label>{ tr(`table.column.${field}`) }</label>
        </div>
      </div>
    });

    const layoutClassName = (layout) =>
      `ui ${this.state.layout === layout ? 'active' : ''} vertical animated icon button`;
    const options = (
      <div className="inventory-options-wrapper">
        <div className="ui basic fluid buttons">
          <div className={layoutClassName('Cards')} tabIndex="0" onClick={(ev) => this.toggleLayout('Cards')}>
            <div className="hidden content">Card Layout</div>
            <div className="visible content">
              <i className="grid layout icon"/>
            </div>
          </div>
          <div className={layoutClassName('List')} tabIndex="0" onClick={(ev) => this.toggleLayout('List')}>
            <div className="hidden content">List Layout</div>
            <div className="visible content">
              <i className="list layout icon"/>
            </div>
          </div>
        </div>

        <div className="ui fluid toggle checkbox">
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
                 onClick={() => {
                   this.setState({ groupByCategory: !this.state.groupByCategory });
                   LocalStorageUtil.saveFieldForComponent('KitchenInventory', 'groupByCategory', !this.state.groupByCategory);
                 }}/>
          <label>Group by category</label>
        </div>

        <div className="ui fluid toggle checkbox">
          <input type="checkbox"
                 name="public"
                 checked={this.state.groupByZone}
                 onClick={ () => {
                   this.setState({ groupByZone: !this.state.groupByZone });
                   LocalStorageUtil.saveFieldForComponent('KitchenInventory', 'groupByZone', !this.state.groupByZone);
                 }}/>
          <label>Group by zone</label>
        </div>

        { this.state.layout === 'List' && <div className="ui form">
          <div className="inline fields">
            <label>Fields</label>
            { fieldCheckboxes }
          </div>
        </div> }
      </div>
    );

    console.log(this.props.kitchenIndex['5cd39468e2690b06fc88854a']);
    return (
      <div className="kitchen-inventory">
        { this.state.showAddModal && <AddModal onCancel={ () => this.setState({ showAddModal: false }) }/> }
        <div className="inventory-wrapper">
        <div className="header">
          <div className="ui fluid basic icon buttons">
            <button className="ui button expand-filters-button"
                                                   onClick={this.toggleFilterExpansion}>
              <i className="filter icon"/>
              { this.state.expandFilters ? tr('inventory.cta.Close Filters') : tr('inventory.cta.Expand Filters') }
            </button>
            <button className="ui button expand-options-button"
                                                   onClick={this.toggleOptions}>
              <i className="sliders horizontal icon"/>
              { this.state.expandOptions ? tr('inventory.cta.Close Options') : tr('inventory.cta.Expand Options') }
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
          <button className="ui large purple button" onClick={ () => this.setState({ showAddModal: true } )}>Add Item</button>
        </FixedFooter>
      </div>
    );
  }
}

export default withKitchen(KitchenInventory);
