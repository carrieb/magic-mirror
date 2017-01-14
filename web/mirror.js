import React from 'react';
import { render } from 'react-dom';

import Header from './components/header';

window.onload = function() {
  console.log('hey');
  render(
    <Header/>,
    document.getElementById("render-wrapper")
  );
}
