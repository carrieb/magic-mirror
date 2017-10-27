import React from 'react';
import PropTypes from 'prop-types';

class Dropdown extends React.Component {
  componentDidMount() {
      $(this.dropdown).dropdown(this.props.options);
      if (this.props.defaultValue) {
        $(this.dropdown).dropdown('set selected', this.props.defaultValue);
      }
  }

  render() {
    const className = `ui ${this.props.className || ''} dropdown`;
    return (
      <div className={className} ref={(ref) => this.dropdown = ref}>
        <input type="hidden"/>
        <i className="dropdown icon"/>
        <div className="default text">Select</div>
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
  defaultValue: PropTypes.string
};

export default Dropdown;
