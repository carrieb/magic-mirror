import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route } from 'react-router';
import { Link } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';

const history = createHistory();

import RecipesNavigation from 'components/recipes/RecipesNavigation.react';

import ApiRecipesList from 'components/recipes/ApiRecipesList.react';
import ApiAddRecipeForm from 'components/recipes/ApiAddRecipeForm.react';
import ImportRecipeForm from 'components/recipes/import-recipe-form.react';
import FullRecipeView from 'components/recipes/full-recipe-view.react';

import ShoppingList from 'components/shared/shopping-list.react';

import RecipeUtil from 'util/recipe-util';

// TODO: migrate to sass
import 'styles/recipes/recipes.css';

import 'sass/recipes/recipes.scss';

import _find from 'lodash/find';
import _clone from 'lodash/clone';

class Recipes extends React.Component {
  constructor(props) {
    super(props);
    this.addRecipeToList = this.addRecipeToList.bind(this);
    this.state = { shoppingList: [] }
  }

  addRecipeToList(recipe) {
    const shoppingList = _clone(this.state.shoppingList);
    const items = RecipeUtil.getAllIngredients(recipe);
    items.forEach((item) => {
      const found = _find(shoppingList, ['name', item.name]);
      if (found) {
        // TODO: add to quantity
      } else {
        shoppingList.push(item);
      }
    })
    this.setState({ shoppingList });
  }

  render() {
    return (
      <div className="ui container recipes-route-wrapper">
        <ShoppingList items={this.state.shoppingList}/>
        <ApiRecipesList addRecipeToList={this.addRecipeToList}/>
        <div className="footer">
          <div className="add-recipe-button">
            <Link to="/recipes/add">
              <button className="ui fluid huge purple button">
                Add Recipe
              </button>
            </Link>
          </div>
        </div>
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
        <Route path="/recipes/import" component={ImportRecipeForm}/>
        <Route path="/recipes/:id/edit" component={ApiAddRecipeForm}/>
        <Route path="/recipes/:id" exact={true} component={FullRecipeView}/>
      </div>
    </Router>,
    document.getElementById("render-wrapper")
  );
}
