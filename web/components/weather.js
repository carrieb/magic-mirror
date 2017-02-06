import React from 'react';
import moment from 'moment';

import ApiWrapper from '../util/api-wrapper';

const isNight = () => {
  const hour = moment().hour();
  return hour < 6 || hour > 20;
}

const iconForWeather = (weather, switchByTime=false) => {
  let icon;
  const showNightIcon = switchByTime && isNight()
  //console.log(weather);
  switch (weather) {
    case 'Mostly Cloudy':
      icon = 'wi-cloudy';
      break;
    case 'Partly Cloudy':
      icon = 'wi-day-cloudy';
      break;
    case 'Overcast':
      icon = showNightIcon ? 'wi-day-sunny-overcast' : 'wi-night-cloudy-high';
      break;
    case 'Chance of Rain':
      icon = showNightIcon ? 'wi-night-showers' : 'wi-day-showers';
      break;
    case 'Chance of a Thunderstorm':
      icon = showNightIcon ? 'wi-night-storm-showers' : 'wi-day-storm-showers';
      break;
    default:
      console.log('unknown weather', weather);
      icon = 'wi-day-sunny'
      break;
  }
  //console.log(weather, icon);
  return (<i className={`wi ${icon}`}></i>);
}

const Weather = React.createClass({
  componentWillMount() {
    // ApiWrapper.getCurrentTemp((conditions) => {
    //   this.setState({
    //     conditions,
    //     conditionsLoaded: true
    //   });
    // });
    //
    // ApiWrapper.getForecast((forecast) => {
    //   this.setState({
    //     forecast,
    //     forecastLoaded: true
    //   });
    // })
  },

  getInitialState() {
    return {
      conditions: null,
      forecast: null,
      conditionsLoaded: false,
      forecastLoaded: false
    }
  },

  render() {
    let conditionsContent;
    let forecastContent;
    if (this.state.forecastLoaded) {
      const nextThreeDays = this.state.forecast.slice(1, 4);
      const forecastEls = nextThreeDays.map((forecast, idx) => {
        return (
          <div className="col-xs-4 text-center forecast-container" key={idx}>
            { iconForWeather(forecast.conditions) }
            <div>
              <span>{forecast.low.fahrenheit}</span><span>{forecast.high.fahrenheit}</span>
            </div>
            { idx == 0 ? 'Tomorrow' : forecast.date.weekday }
          </div>
        );
      });
      forecastContent = (
        <div className="forcasts-container">
          <div className="row">
             { forecastEls }
          </div>
        </div>
      );
    }
    if (this.state.conditionsLoaded) {
      let todaysForecast;
      let warningMsg = "";
      if (this.state.forecastLoaded) {
        const forecast = this.state.forecast[0];
        todaysForecast = (
          <div>
            <span>{forecast.low.fahrenheit}</span><span>{forecast.high.fahrenheit}</span>
          </div>
        );

        if (forecast.qpf_allday.in > 0) {
            warningMsg += "It's going to rain today. Grab an umbrella.\n"
        }
        if (forecast.low.fahrenheit < 50) {
          warningMsg += "It's going to get chilly today.\n"
        } else if (forecast.low.fahrenheit < 60) {
          warningMsg += "It's going to get cold today.\n"
        }
      }

      conditionsContent = (
        <div className="current-conditions-container">
          <div className="pull-left text-center left-image">
            { iconForWeather(this.state.conditions.weather) }
            { todaysForecast }
          </div>
          It's <b>{ this.state.conditions.temp_f }°F</b> outisde right now.<br/>
          <span className="warning">{ warningMsg }</span>
        </div>
      );
    }
    return (
      <div className="weather-container">
        { conditionsContent }
        { forecastContent }
      </div>
    );
  }
});

export default Weather;
