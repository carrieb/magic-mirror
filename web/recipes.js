import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route } from 'react-router';
import { Link } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';

const history = createHistory();

import RecipesNavigation from 'components/recipes/RecipesNavigation.react';

import ApiRecipesList from 'components/recipes/ApiRecipesList.react';
import ApiAddRecipeForm from 'components/recipes/ApiAddRecipeForm.react';

import 'styles/recipes/recipes.css';

class Recipes extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="ui container">
        <ApiRecipesList/>
        <Link to="/recipes/add">
          <button className="ui basic huge fluid purple button add-recipe-button">
            Add Recipe
          </button>
        </Link>
      </div>
    );
  }
}

window.onload = function() {
  ReactDOM.render(
    <Router history={history}>
      <div className="ui container recipes-container">
        <RecipesNavigation/>
        <Route path="/recipes" exact={true} component={Recipes}/>
        <Route path="/recipes/add" component={ApiAddRecipeForm}/>
        <Route path="/recipes/import"/>
      </div>
    </Router>,
    document.getElementById("render-wrapper")
  );
}
