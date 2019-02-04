import React from 'react';
import { render } from 'react-dom';

import Header from 'components/header';
import Weather from 'components/weather';
import Wanikani from 'components/wanikani';
import Wunderlist from 'components/wunderlist';
import Calendar from 'components/calendar';
import GuildWars from 'components/guildwars.react';
import BackgroundVideo from 'components/background-video';
import CombinedVerticalCalendar from 'components/mirror/combined-vertical-calendar.react';

import 'sass/mirror/mirror.scss';

class Mirror extends React.Component {
  componentWillMount() {
    document.title = 'magic mirror on the wall';
  }


  render() {
    // TODO: add back background video
    return (
      <div className="mirror">
        <div className="ui grid">
          <div className="four wide column">
            <CombinedVerticalCalendar/>
          </div>
          <div className="eight wide column">
            <Header/>
            <Weather/>
          </div>
          <div className="four wide column">
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
