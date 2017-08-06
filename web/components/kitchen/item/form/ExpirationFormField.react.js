import React from 'react';
import PropTypes from 'prop-types';

import InputDropdownGroup from 'components/common/input-dropdown-group.react';

import uniqueId from 'lodash/uniqueId';
import isEqual from 'lodash/isEqual';

class ExpirationFormField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      length: null,
      delta: 'weeks'
    }
  }

  onDeltaChange(value, text, choice) {
    this.setState({ delta: value });
  }

  onLengthChange(ev) {
    const length = parseInt(ev.target.value);
    this.setState({ length });
  }

  componentWillUpdate(newProps, newState) {
    if (!isEqual(this.state, newState)) {
      this.props.onChange(newState);
    }
  }

  render() {
    return (
      <InputDropdownGroup className={this.props.className}
        options={['days', 'weeks', 'months']}
        defaultDropdownValue={this.props.expiration ? this.props.expiration.delta : 'weeks'}
        onDropdownChange={(val, text, choice) => this.onDeltaChange(val, text, choice)}>
        <input value={this.props.expiration ? this.props.expiration.length : ''}
          type="number"
          placeholder="3"
          min="1" onChange={(ev) => this.onLengthChange(ev)}/>
      </InputDropdownGroup>
    );
  }
}

ExpirationFormField.propTypes = {
  className: PropTypes.string,
  onChange: PropTypes.func
}

export default ExpirationFormField;
