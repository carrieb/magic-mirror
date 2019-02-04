import React from 'react';
import PropTypes from 'prop-types';

import _kebabCase from 'lodash/kebabCase';

import { tr } from 'util/translation-util'

class ImageOption extends React.Component {
  render() {
    const { name, type } = this.props;
    const displayText = tr(`${type}.${name}`);
    return (
      <div key={name} className={`item ${this.props.selected ? 'selected' : ''}`} data-value={name}>
        <img src={`/images/kitchen/${_kebabCase(name.toLowerCase())}.png`}/>
        { displayText }
      </div>
    );
  }
}

ImageOption.propTypes = {
  name: PropTypes.string.isRequired
}

module.exports = ImageOption;
