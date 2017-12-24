import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route } from 'react-router';
import createHistory from 'history/createBrowserHistory';

const history = createHistory();

import FoodEditorHandler from 'components/kitchen/FoodEditorHandler';
import AddItemsForm from 'components/kitchen/AddItemsForm.react';

import KitchenNavigation from 'components/kitchen/KitchenNavigation.react';
import KitchenInventory from 'components/kitchen/KitchenInventory.react';
import KitchenDashboard from 'components/kitchen/kitchen-dashboard.react';

import MessagingUtil from 'util/messaging-util';

//MessagingUtil.subscribeDevice();

window.onload = function() {
  ReactDOM.render(
    <Router history={history}>
      <div className="ui container kitchen-container">
        <KitchenNavigation/>
        <Route exact path="/kitchen" component={KitchenDashboard}/>
        <Route path="/kitchen/inventory" component={KitchenInventory}/>
        <Route path="/kitchen/unpack" component={AddItemsForm}/>
        <Route path="/kitchen/item/:foodName" component={FoodEditorHandler}/>
      </div>
    </Router>,
    document.getElementById("render-wrapper")
  );
}
