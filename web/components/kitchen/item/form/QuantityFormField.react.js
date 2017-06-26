import React from 'react';

import InputDropdownGroup from 'components/common/input-dropdown-group.react';

import isEqual from 'lodash/isEqual';

const QuantityFormField = React.createClass({
  propTypes: {
    className: React.PropTypes.string,
    onChange: React.PropTypes.func
  },

  getInitialState() {
    return {
      amount: null,
      unit: 'quarter cup'
    }
  },

  onUnitChange(value, text, choice) {
    this.setState({ unit: value });
  },

  onAmountChange(ev) {
    const amount = parseInt(ev.target.value);
    this.setState({ amount });
  },

  componentWillUpdate(newProps, newState) {
    if (!isEqual(this.state, newState)) {
      this.props.onChange(newState);
    }
  },

  render() {
    return (
      <InputDropdownGroup className={this.props.className}
        options={['tsp', 'tbsp', 'quarter cup', 'cup']}
        defaultDropdownValue={this.props.quantity ? this.props.quantity.unit : 'cup'}
        onDropdownChange={this.onUnitChange}>
        <input value={this.props.quantity ? this.props.quantity.amount : ''} type="number" placeholder="3" min="1" onChange={this.onAmountChange}/>
      </InputDropdownGroup>
    );
  }
});

export default QuantityFormField;
