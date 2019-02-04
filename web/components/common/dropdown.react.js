import React from 'react';
import PropTypes from 'prop-types';

import _isEqual from 'lodash/isEqual';

class Dropdown extends React.Component {
  componentDidMount() {
      // NOTE: This is not the options for the select, but the dropdown module options e.g. onChange
      console.log(this.props.options, this.props.value);
      $(this.dropdown).dropdown(this.props.options);
      if (this.props.value) {
        $(this.dropdown).dropdown('set selected', this.props.value);
      }
  }

  componentDidUpdate(prevProps) {
    if (!_isEqual(prevProps.children, this.props.children)) {
      console.log('updated children detected');
      $(this.dropdown).dropdown('refresh');
    }

    if (!_isEqual(prevProps.value, this.props.value)) {
      $(this.dropdown).dropdown('set selected', this.props.value);
    }
  }

  render() {
    const className = `ui ${this.props.className || ''} dropdown`;
    return (
      <div className={className} ref={(ref) => this.dropdown = ref}>
        <input type="hidden"/>
        <i className="dropdown icon"/>
        <div className="default text">{ this.props.defaultText || 'Select' }</div>
        <div className="menu">
          { this.props.children }
        </div>
      </div>
    );
  }
}

Dropdown.propTypes = {
  className: PropTypes.string,
  options: PropTypes.object,
  value: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.string
  ]),
  defaultText: PropTypes.string
};

export default Dropdown;
