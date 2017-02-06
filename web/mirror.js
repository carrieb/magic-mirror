import React from 'react';
import { render } from 'react-dom';

import Header from './components/header';
import Weather from './components/weather';
import Wanikani from './components/wanikani';
import Wunderlist from './components/wunderlist';
import Calendar from './components/calendar';
import GuildWars from './components/guildwars';

window.onload = function() {
  //console.log('hey');
  render(
    <div className="row mirror-container">
      <div className="col-xs-3">
        <Wunderlist/>
      </div>
      <div className="col-xs-6">
        <Header/>
        <Weather/>
        <Calendar/>
      </div>
      <div className="col-xs-3">
        <Wanikani/>
        <GuildWars/>
      </div>
    </div>,
    document.getElementById("render-wrapper")
  );
}
