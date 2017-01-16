import React from 'react';

const Header = React.createClass({
  propTypes: {
    name: React.PropTypes.string
  },

  getDefaultProps() {
    return {
      name: 'Carrie'
    }
  },

  render() {
    return (
      <div className="header-container text-center">
        <h1>Good Morning, { this.props.name }!</h1>
      </div>
    );
  }
});

export default Header;
