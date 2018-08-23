import React from 'react';
import PropTypes from 'prop-types';

import _kebabCase from 'lodash/kebabCase';

class ImageOption extends React.Component {
  render() {
    const { name } = this.props;
    return (
      <div key={name} className="item" data-value={name}>
        <img src={`/images/kitchen/${_kebabCase(name.toLowerCase())}.png`}/>
        {name}
      </div>
    );
  }
}

ImageOption.propTypes = {
  name: PropTypes.string.isRequired
}

module.exports = ImageOption;
