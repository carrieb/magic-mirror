import React from 'react';
import PropTypes from 'prop-types';

import _set from 'lodash/set';

class IngredientsInputs extends React.Component {
  handleChange(ev, field) {
    if (this.props.onChange) {
      const value = this.props.value;
      _set(value, field, ev.target.value);
      this.props.onChange(value);
    }
  }

  render() {
    const value = this.props.value;
    return <div className="ingredients-fields">
      <div className="fields">

        <div className="seven wide field">
          <label>Quantity</label>

          <div className="two fields">
            <div className="field">
              <input type="number"
                step="0.25"
                placeholder="1"
                onChange={(ev) => this.handleChange(ev, 'quantity.amount')}
                value={value.quantity.amount}/>
            </div>
            <div className="field">
              <input type="text"
                placeholder="pkg"
                onChange={(ev) => this.handleChange(ev, 'quantity.unit')}
                value={value.quantity.unit}/>
            </div>
          </div>
        </div>

        <div className="four wide field">
          <label>Modifier</label>
          <input type="text"
                 value={value.modifier}
                 onChange={(ev) => this.handleChange(ev, 'modifier')}/>
        </div>

        <div className="five wide field">
          <label>Ingredient</label>
          <input type="text"
                value={value.name}
                onChange={(ev) => this.handleChange(ev, 'name')}/>
        </div>

      </div>
    </div>;
  }
}

IngredientsInputs.propTypes = {
  index: PropTypes.number.isRequired,
  onChange: PropTypes.func
}

export default IngredientsInputs;
