import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import 'styles/mirror/header.css';

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      time: moment()
    }
  }

  componentWillMount() {
    setInterval(() => {
      this.setState({ time: moment() });
    }, 1000 * 60); // every minute update time
  }

  getGreeting() {
    const hour = this.state.time.hour();
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
  }

  render() {
    const now = this.state.time;
    return (
      <div className="header-container">
        <h1>{ this.getGreeting() }, { this.props.name }!</h1>
        <p>It's { now.format('dddd, MMMM Do') }.</p>
        <p> { now.format('LT') }</p>
      </div>
    );
  }
};

Header.propTypes = {
  name: PropTypes.string
}

Header.defaultProps = {
  name: 'Carrie'
}

export default Header;
