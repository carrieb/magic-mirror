import React from 'react';
import PropTypes from 'prop-types';

import _noop from 'lodash/noop';

class AnimatedButton extends React.Component {
  render() {
    const className = `ui ${this.props.active ? this.props.activeClassName : this.props.inactiveClassName } vertical animated icon button`;
    return (
      <div className={className} tabIndex="0" onClick={this.props.onClick}>
        <div className="hidden content">{this.props.text}</div>
        <div className="visible content">
          <i className={`${this.props.icon} icon`}/>
        </div>
      </div>
    );
  }
}

AnimatedButton.propTypes {
  active: PropTypes.bool,
  activeClassName: PropTypes.string,
  inactiveClassName: PropTypes.string,
  onClick: PropTypes.func,

  text: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired
};

AnimatedButton.defaultProps = {
  active: false,
  activeClassName: 'active',
  inactiveClassName: '',
  onClick: _noop
};

export default AnimatedButton;
