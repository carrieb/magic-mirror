import React from 'react';

import DropdownOptions from './dropdown-options';

const InputDropdownGroup = React.createClass({
  propTypes: {
    options: React.PropTypes.array.isRequired,
    defaultDropdownValue: React.PropTypes.string.isRequired,
    onDropdownChange: React.PropTypes.func,
    className: React.PropTypes.string,
    dropdownOptions: React.PropTypes.object
  },

  handleDropdownRef(ref) {
    this.dropdown = ref;
    // TOOD: assign dropdownOptions
    $(this.dropdown).dropdown({
      onChange: this.props.onDropdownChange,
      allowAdditions: true
    });
  },

  render() {
    return (
      <div className={this.props.className}>
        <div className="ui fluid right action input">
          { this.props.children }
          <div className="ui basic compact dropdown button" ref={this.handleDropdownRef}>
            <div className="text">{this.props.defaultDropdownValue}</div>
            <i className="dropdown icon"></i>
            <DropdownOptions options={this.props.options} />
          </div>
        </div>
      </div>
    );
  }
});

export default InputDropdownGroup;
