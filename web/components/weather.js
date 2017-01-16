import React from 'react';

import ApiWrapper from '../util/api-wrapper';

const Weather = React.createClass({
  componentWillMount() {
    ApiWrapper.getCurrentTemp((temp) => {
      this.setState({ temp });
    });
  },

  getInitialState() {
    return {
      temp: null
    }
  },

  render() {
    let content = null;
    if (this.state.temp) {
      content = (<div className="weather-container">It's { this.state.temp }°F outisde right now.</div>);
    }
    return content;
  }
});

export default Weather;
