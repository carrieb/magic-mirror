import React from 'react';
import PropTypes from 'prop-types';

class TextInput extends React.Component {
  render() {
    return (
      <div className={`field ${this.props.className ? this.props.className : ''}`}>
        <label>{ this.props.labelText }</label>
        <input type="text"
          value={ this.props.value }
          onChange={ this.props.onChange }/>
        { this.props.children }
      </div>
    );
  }
}

TextInput.propTypes = {
  value: PropTypes.any,
  labelText: PropTypes.string,
  onChange: PropTypes.func,
  className: PropTypes.string
}

export default TextInput;
