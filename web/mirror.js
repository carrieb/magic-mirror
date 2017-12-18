import React from 'react';
import { render } from 'react-dom';

import Header from './components/header';
import Weather from './components/weather';
import Wanikani from './components/wanikani';
import Wunderlist from './components/wunderlist';
import Calendar from './components/calendar';
import GuildWars from './components/guildwars.react';
import BackgroundVideo from './components/background-video';

class Mirror extends React.Component {
  componentWillMount() {
    document.title = 'magic mirror on the wall';
  }

  render() {
    return (
      <div className="mirror-container">
        <BackgroundVideo/>
        <div className="ui grid">
          <div className="left floated four wide column">
            <Wunderlist/>
            <Calendar/>
          </div>
          <div className="six wide column">
            <Header/>
            <Weather/>
          </div>
          <div className="right floated four wide column">
            <Wanikani/>
            <GuildWars/>
          </div>
        </div>
      </div>
    );
  }
}

window.onload = function() {
  render(
    <Mirror/>,
    document.getElementById("render-wrapper")
  );
}
