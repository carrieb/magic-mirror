import _clone from 'lodash/clone';
import _uniqueId from 'lodash/uniqueId';
import _find from 'lodash/find';
import _debounce from 'lodash/debounce';
import _assign from 'lodash/assign';
import _filter from 'lodash/filter';

import ApiWrapper from 'util/api-wrapper';

import React from 'react';

let recipes = [];

const EMPTY_RECIPE = {
  name: '',
  img: '',
  source: '',
  category: '',
  servings: 0,
  ingredients: [ {} ],
  directions: [ {} ],
  tags: [ ]
}

const EMPTY_INGREDIENT = {
  name: '',
  quantity: {
    amount: 0,
    unit: ''
  },
  modifier: ''
}

let listeners = [];
let loadedRecipes = [];
let loadedRecipesIndex = {};

const RecipesState = {
  getRecipes() {
    this.debouncedRequest();
  },

  debouncedRequest: _debounce(() => {
    //console.log('kitchen state submitting ajax request');
    ApiWrapper.getRecipes()
      .done(RecipesState.done);
  }, 5000, {
    leading: true,
    trailing: false
  }),

  done: (recipes) => {
    loadedRecipes = recipes;

    const recipesIndex = {};
    recipes.forEach((recipe) => {
      recipesIndex[recipe._id] = _assign(_clone(EMPTY_RECIPE), recipe);
    });
    loadedRecipesIndex = recipesIndex

    console.log(`recipes state loaded. ${loadedRecipes.length} recipes. alerting ${listeners.length} listeners.`);

    //console.log('recipe state loaded', loadedRecipes, loadedRecipesIndex, listeners);
    RecipesState.alertListeners();
  },

  deleteRecipe(id) {
    ApiWrapper.deleteRecipe(id)
      .done(() => {
        const recipes = _filter(loadedRecipes, (recipe) => recipe._id !== id);
        this.done(recipes);
      });
  },

  addChangeListener(callback) {
    listeners.push(callback);
  },

  removeChangeListener(callback) {
    listeners = listeners.filter((cb) => {
      !Object.is(cb, callback)
    });
  },

  alertListeners() {
    listeners.forEach((callback) => {
      callback(loadedRecipes, loadedRecipesIndex);
    });
  }
};

function withRecipes(WrappedComponent) {
  return class extends React.Component {
    constructor(props) {
      super(props);

      RecipesState.addChangeListener(this.handleChange);
      RecipesState.getRecipes();

      this.state = {
        recipes: loadedRecipes,
        recipesIndex: loadedRecipesIndex
      }
    }

    componentWillUnmount() {
      RecipesState.removeChangeListener(this.handleChange);
    }

    handleChange = (recipes, recipesIndex) => {
      this.setState({
        recipes,
        recipesIndex
      });
    };

    deleteRecipe = (recipe) => {
      RecipesState.deleteRecipe(recipe._id);
    }

    render() {
      return (
        <WrappedComponent recipes={this.state.recipes}
                          recipesIndex={this.state.recipesIndex}
                          deleteRecipe={this.deleteRecipe}
                          {...this.props}/>
      );
    }
  };
}

module.exports = { withRecipes, RecipesState, EMPTY_RECIPE, EMPTY_INGREDIENT};
