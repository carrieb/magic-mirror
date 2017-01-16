import React from 'react';
import { render } from 'react-dom';

import Header from './components/header';
import Weather from './components/weather';

window.onload = function() {
  console.log('hey');
  render(
    <div className="row">
      <div className="col-xs-3">I am left rail content</div>
      <div className="col-xs-6">
        <Header/>
        <Weather/>
      </div>
      <div className="col-xs-3">I am right rail content</div>
    </div>,
    document.getElementById("render-wrapper")
  );
}
