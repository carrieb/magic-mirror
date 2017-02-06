import React from 'react';
import moment from 'moment';

const Header = React.createClass({
  propTypes: {
    name: React.PropTypes.string
  },

  getDefaultProps() {
    return {
      name: 'Carrie'
    }
  },

  getGreeting() {
    const hour = moment().hour()
    //console.log(hour)
    if (hour < 4) {
      return 'Good Night';
    } else if(hour < 12) {
      return 'Good Morning';
    } else if (hour < 15) {
      return 'Good Day';
    } else if (hour < 21) {
      return 'Good Evening';
    } else {
      return 'Good Night';
    }
  },

  render() {
    const now = moment()
    return (
      <div className="header-container">
        <h1>{ this.getGreeting() }, { this.props.name }!</h1>
        <p>It's { now.format('dddd, MMMM Do') }.</p>
        <p> { now.format('LT') }</p>
      </div>
    );
  }
});

export default Header;
