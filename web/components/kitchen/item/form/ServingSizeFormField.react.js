import React from 'react';
import PropTypes from 'prop-types';

import InputDropdownGroup from 'components/common/input-dropdown-group.react';

import isEqual from 'lodash/isEqual';

class ServingSizeFormField extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      amount: 1,
      unit: 'quarter cup'
    };
  }

  onUnitChange(value, text, choice) {
    this.setState({ unit: value });
  }

  onAmountChange(ev) {
    const amount = parseInt(ev.target.value);
    this.setState({ amount });
  }

  componentWillUpdate(newProps, newState) {
    if (!isEqual(this.state, newState)) {
      this.props.onChange(newState);
    }
  }

  render() {
    return (
      <InputDropdownGroup
        className={this.props.className}
        options={['tsp', 'tbsp', 'quarter cup', 'cup']}
        defaultDropdownValue={this.props.servingSize ? this.props.servingSize.unit : 'cup'}
        onDropdownChange={(value, text, choice) => this.onUnitChange(value, text, choice)}>
        <input value={this.props.servingSize ? this.props.servingSize.amount : ''}
          type="number"
          placeholder="3"
          min="1"
          onChange={(ev) => this.onAmountChange(ev)}/>
      </InputDropdownGroup>
    );
  }
}

ServingSizeFormField.propTypes = {
  className: PropTypes.string,
  onChange: PropTypes.func
};

export default ServingSizeFormField;
