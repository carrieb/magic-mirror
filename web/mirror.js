import React from 'react';
import { render } from 'react-dom';

import Header from './components/header';
import Weather from './components/weather';
import Wanikani from './components/wanikani';
import Wunderlist from './components/wunderlist';

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
      </div>
      <div className="col-xs-3">
        <Wanikani/>
      </div>
    </div>,
    document.getElementById("render-wrapper")
  );
}
