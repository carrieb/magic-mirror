import React from 'react';
import PropTypes from 'prop-types';

import InputDropdownGroup from 'components/common/input-dropdown-group.react';

import isEqual from 'lodash/isEqual';

class QuantityFormField extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      amount: 1,
      unit: 'cup'
    };
  }

  onUnitChange(value, text, choice) {
    console.log(value, text, choice);
    this.setState({ unit: value });
  }

  onAmountChange(ev) {
    const amount = parseFloat(ev.target.value);
    this.setState({ amount });
  }

  componentWillUpdate(newProps, newState) {
    if (!isEqual(this.state, newState)) {
      this.props.onChange(newState);
    }
  }

  render() {
    // TODO: lookup quantities from 'src/quantities' for locale
    return (
      <InputDropdownGroup className={this.props.className}
        options={['tsp', 'tbsp', 'quarter cup', 'cup', 'gram', 'ml', 'oz', 'pkg', 'lb', 'can']}
        defaultDropdownValue={this.props.quantity ? this.props.quantity.unit : 'cup'}
        onDropdownChange={(value, text, choice) => this.onUnitChange(value, text, choice)}>
        <input value={this.props.quantity ? this.props.quantity.amount : ''}
          type="number" step="any"
          onChange={(ev) => this.onAmountChange(ev)}/>
      </InputDropdownGroup>
    );
  }
}

QuantityFormField.propTypes = {
  quantity: PropTypes.object,
  className: PropTypes.string,
  onChange: PropTypes.func
}

export default QuantityFormField;
