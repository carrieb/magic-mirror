import React from 'react';
import PropTypes from 'prop-types';

import DropdownOptions from './dropdown-options';

class InputDropdownGroup extends React.Component {
  componetnDidMount() {
    // TOOD: assign dropdownOptions
    $(this.dropdown).dropdown({
      onChange: this.props.onDropdownChange,
      allowAdditions: true
    });
  }

  render() {
    return (
      <div className={this.props.className}>
        <div className="ui fluid right action input">
          { this.props.children }
          <div className="ui basic compact dropdown button" ref={(ref) => this.dropdown = ref}>
            <div className="text">{this.props.defaultDropdownValue}</div>
            <i className="dropdown icon"></i>
            <DropdownOptions options={this.props.options} />
          </div>
        </div>
      </div>
    );
  }
}

InputDropdownGroup.propTypes = {
  options: PropTypes.array.isRequired,
  defaultDropdownValue: PropTypes.string.isRequired,
  onDropdownChange: PropTypes.func,
  className: PropTypes.string,
  dropdownOptions: PropTypes.object
}

export default InputDropdownGroup;
