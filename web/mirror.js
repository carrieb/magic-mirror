import React from 'react';
import { render } from 'react-dom';

import Header from './components/header';
import Weather from './components/weather';
import Wanikani from './components/wanikani';
import Wunderlist from './components/wunderlist';
import Calendar from './components/calendar';
import GuildWars from './components/guildwars.react';
import BackgroundVideo from './components/background-video';

window.onload = function() {
  render(
    <div className="mirror-container">
      <BackgroundVideo/>
      <div className="row">
        <div className="col-xs-3">
          <Wunderlist/>
          <Calendar/>
        </div>
        <div className="col-xs-6">
          <Header/>
          <Weather/>
        </div>
        <div className="col-xs-3">
          <Wanikani/>
          <GuildWars/>
        </div>
      </div>
    </div>,
    document.getElementById("render-wrapper")
  );
}
