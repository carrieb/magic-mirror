import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route } from 'react-router';
import { Link } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';

const history = createHistory();

import RecipesNavigation from 'components/recipes/RecipesNavigation.react';
import SearchRecipesByNameDropdown from 'components/recipes/search-recipes-by-name-dropdown.react';

import RecipesList from 'components/recipes/recipes-list.react';
import RecipeEditor from 'components/recipes/recipe-editor.react';
import ImportRecipeForm from 'components/recipes/import-recipe-form.react';
import FullRecipeView from 'components/recipes/full-recipe-view.react';

import { ShoppingList, withShoppingList } from 'components/shared/shopping-list.react';

import RecipeUtil from 'util/recipe-util';

import 'sass/recipes/recipes.scss';

import _find from 'lodash/find';
import _clone from 'lodash/clone';

// TODO: fix bug where bottom slick
// navigates incorrectly on screen size change

class Recipes extends React.Component {
  render() {
    return (
      <div className="ui container recipes-route-wrapper">
        <SearchRecipesByNameDropdown/>
        <RecipesList/>
      </div>
    );
  }
}

window.onload = function() {
  ReactDOM.render(
    <Router history={history}>
      <div className="ui container recipes-container" style={{ marginTop: '10px' }}>
        <RecipesNavigation/>
        <Route path="/recipes" exact={true} component={Recipes}/>
        <Route path="/recipes/add" exact={true} component={RecipeEditor}/>
        <Route path="/recipes/import" exact={true} component={ImportRecipeForm}/>
        <Route path="/recipes/r/:id/edit" exact={true} component={RecipeEditor}/>
        <Route path="/recipes/r/:id" exact={true} component={FullRecipeView}/>
      </div>
    </Router>,
    document.getElementById("render-wrapper")
  );
}
