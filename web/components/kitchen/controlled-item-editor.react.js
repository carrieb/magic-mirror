import React from 'react';
import PropTypes from 'prop-types';

import Dropdown from 'components/common/dropdown.react';

import ExpirationFormField from './item/form/ExpirationFormField.react';
import ServingSizeFormField from './item/form/ServingSizeFormField.react';
import QuantityFormField from './item/form/QuantityFormField.react';

import KitchenConstants from 'state/kitchen/kitchen-constants';

import { tr } from 'util/translation-util';

import _kebabCase from 'lodash/kebabCase';

class ItemEditor extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const valueToOption = (val) => (
      <div className="item" data-value={val} key={val}>
        <img className="ui mini avatar image" src={`/images/kitchen/${_kebabCase(val.toLowerCase())}.png`}/>
        {val}
      </div>
    );

    const zoneOptions = KitchenConstants.ALL_ZONES.map(valueToOption);
    const categoryOptions = KitchenConstants.ALL_CATEGORIES.map(valueToOption);

    return (
      <div className="ui grid controlled-item-editor">
        <div className="five wide column">
          <h5>Quantity </h5>
        </div>
        <QuantityFormField className="eleven wide column"
          quantity={this.props.foodItem.quantity}
          onChange={(q) => this.props.onChange('quantity', q)}/>

        <div className="five wide column">
          <h5>Serving Size</h5>
        </div>
        <ServingSizeFormField className="eleven wide column"
          servingSize={this.props.foodItem.servingSize}
          onChange={(ss) => this.props.onChange('servingSize', ss)}/>

        <div className="five wide column">
          <h5>Expiration</h5>
        </div>
        <ExpirationFormField className="eleven wide column"
          expiration={this.props.foodItem.expiration}
          onChange={(exp) => this.props.onChange('expiration', exp)}/>

        <div className="five wide column">
          <h5>Category</h5>
        </div>
        <div className="eleven wide column">
          <Dropdown className="fluid selection category-dropdown"
                    value={ [this.props.foodItem.category] }
                    options={{ onChange: (value, text, choice) => this.props.onChange('category', value) }}>
            { categoryOptions }
          </Dropdown>
        </div>

        <div className="five wide column">
          <h5>Zone</h5>
        </div>
        <div className="eleven wide column">
          <Dropdown className="fluid selection zone-dropdown"
                    value={ [this.props.foodItem.zone] }
                    options={{ onChange: (value, text, choice) => this.props.onChange('zone', value) }}>
            { zoneOptions }
          </Dropdown>
        </div>

        <div className="five wide column">
          <h5>{ tr('table.column.brand') }</h5>
        </div>
        <div className="eleven wide column">
          <div className="ui fluid input">
            <input type="text"
                   value={this.props.foodItem.brand}
                   onChange={(ev) => this.props.onChange('brand', ev.target.value)}/>
          </div>
        </div>
      </div>
    );
  }
}

ItemEditor.propTypes = {
  foodItem: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
}

export default ItemEditor;
