import React from 'react';
import { render } from 'react-dom';

window.onload = function() {
  console.log('hey');
  render(
    <h1>Hello React</h1>,
    document.getElementById("render-wrapper")
  );
}