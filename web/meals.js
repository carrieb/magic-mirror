import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Redirect, Switch } from 'react-router';
import createHistory from 'history/createBrowserHistory';

const history = createHistory();

import MealsDashboard from 'components/meals/dashboard.react';
import MealsNavigation from 'components/meals/navigation.react';
import MealOverview from 'components/meals/meal-overview.react';
import MealRecipesList from 'components/meals/meal-recipes-list.react';

import 'sass/meals/container.scss';

window.onload = function() {
  ReactDOM.render(
    <Router history={history}>
      <div className="ui container meals-container">
        <MealsNavigation/>
        <Route exact path="/meals" component={MealsDashboard}/>
        <Route path="/meal/:id" component={MealOverview}/>
      </div>
    </Router>,
    document.getElementById("render-wrapper")
  );
}
