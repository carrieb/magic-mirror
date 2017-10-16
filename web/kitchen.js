import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route } from 'react-router';
import createHistory from 'history/createBrowserHistory';

const history = createHistory();

import FoodEditorHandler from 'components/kitchen/FoodEditorHandler';
import AddItemsForm from 'components/kitchen/AddItemsForm.react';

import KitchenNavigation from 'components/kitchen/KitchenNavigation.react';
import KitchenInventory from 'components/kitchen/KitchenInventory.react';

import 'styles/kitchen.css';


window.onload = function() {
  ReactDOM.render(
    <Router history={history}>
      <div className="ui container kitchen-container">
        <KitchenNavigation/>
        <Route exact path="/kitchen" component={KitchenInventory}/>
        <Route path="/kitchen/unpack" component={AddItemsForm}/>
        <Route path="/kitchen/:foodName" component={FoodEditorHandler}/>
      </div>
    </Router>,
    document.getElementById("render-wrapper")
  );
}
