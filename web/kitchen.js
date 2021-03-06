import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route } from 'react-router';
import createHistory from 'history/createBrowserHistory';

import { getLocale } from 'util/translation-util';

const history = createHistory();

import KitchenItemEditor from 'components/kitchen/kitchen-item-editor.react';

import KitchenNavigation from 'components/kitchen/navigation.react';
import KitchenInventory from 'components/kitchen/inventory.react';
import KitchenDashboard from 'components/kitchen/dashboard.react';

//import MessagingUtil from 'util/messaging-util';

//MessagingUtil.subscribeDevice();

window.onload = function() {
  ReactDOM.render(
    <Router history={history}>
      <div className={`ui container kitchen-container ${getLocale()}`}>
        <KitchenNavigation/>
        <Route exact path="/kitchen" component={KitchenDashboard}/>
        <Route path="/kitchen/inventory" component={KitchenInventory}/>
        <Route path="/kitchen/item/:foodName" component={KitchenItemEditor}/>
      </div>
    </Router>,
    document.getElementById("render-wrapper")
  );
}
