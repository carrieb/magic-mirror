import React from 'react';

import InputDropdownGroup from 'components/common/input-dropdown-group.react';

import uniqueId from 'lodash/uniqueId';
import isEqual from 'lodash/isEqual';

const ExpirationFormField = React.createClass({
  propTypes: {
    className: React.PropTypes.string,
    onChange: React.PropTypes.func
  },

  getInitialState() {
    return {
      length: null,
      delta: 'weeks'
    }
  },

  onDeltaChange(value, text, choice) {
    this.setState({ delta: value });
  },

  onLengthChange(ev) {
    const length = parseInt(ev.target.value);
    this.setState({ length });
  },

  componentWillUpdate(newProps, newState) {
    if (!isEqual(this.state, newState)) {
      this.props.onChange(newState);
    }
  },

  render() {
    return (
      <InputDropdownGroup className={this.props.className}
        options={['days', 'weeks', 'months']}
        defaultDropdownValue={this.props.expiration ? this.props.expiration.delta : 'weeks'}
        onDropdownChange={this.onDeltaChange}>
        <input value={this.props.expiration ? this.props.expiration.length : ''} type="number" placeholder="3" min="1" onChange={this.onLengthChange}/>
      </InputDropdownGroup>
    );
  }
});

export default ExpirationFormField;
