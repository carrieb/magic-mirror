import React from 'react';
import PropTypes from 'prop-types';

class CardLayout extends React.Component {
  render() {
    if (this.props.children.length === 0) {
      return (
        <div className="ui fluid card">
          <div className="content">Nothing in inventory.</div>
        </div>
      );
    } else {
      if (this.props.grouped) {
        // TODO: i think i need to pass in the actual data here?
        return <div>'I DUNNO HOW TO GROUP YET'</div>;
      } else {
        return <div className="ui six doubling cards">{ this.props.children }</div>;
      }
    }
  }
}

CardLayout.propTypes = {
  grouped: PropTypes.bool
}

CardLayout.defaultProps = {
  grouped: false
}

module.exports = CardLayout;
