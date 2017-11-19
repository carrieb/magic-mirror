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
    } else if (hour < 18) {
      return 'Good Afternoon';
    } else if (hour < 21) {
      return 'Good Evening';
    } else {
      return 'Good Night';
    }
  }

  render() {
    const now = this.state.time;
    const cal = (
      <svg className="calendar" width="80" height="80" style={{ float: 'left', marginRight: '20px'}}>
        <text textAnchor="middle" x="40" y="15" style={{ fontFamily: 'Verdana', fill: 'white' }}>
          { now.format('MMM').toUpperCase() }
        </text>
        <rect width="80" height="20" style={{ fill: 'none', stroke: 'white', strokeWidth: '1px'}}/>
        <rect width="80" height="75" style={{ fill: 'none', stroke: 'white', strokeWidth: '1px'}}/>
        <text textAnchor="middle" x="40" y="35" style={{ fontFamily: 'Verdana', fill: 'white' }}>
          { now.format('dddd').toUpperCase() }
        </text>
        <text textAnchor="middle" x="40" y="60" style={{ fontFamily: 'Verdana', fill: 'white', fontSize: '20px', fontWeight: 'bold' }}>
          { now.format('Do') }
        </text>
      </svg>
    );
    return (
      <div className="header-container">
        { cal }
        <h1>{ this.getGreeting() }, { this.props.name }!</h1>
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
