import _clone from 'lodash/clone';
import _uniqueId from 'lodash/uniqueId';
import _find from 'lodash/find';
import _debounce from 'lodash/debounce';
import _assign from 'lodash/assign';

import ApiWrapper from 'util/api-wrapper';

import React from 'react';

const KIMCHI_RECIPE = {
  name: 'Honey-Kimchi Dried Squid',
  img: '/images/recipes/kimchi.JPG',
  servings: 1,
  ingredients: [
    {
      items: [
        {
          name: 'dried squid',
          quantity: { amount: 1, unit: 'pkg' }
        },
        {
          name: 'honey',
          quantity: { amount: .25, unit: 'cup' }
        },
        {
          name: 'gochujang',
          quantity: { amount: .25, unit: 'cup' }
        }
      ]
    }
  ],
  directions: [
    {
      steps: [
        {
          content: 'Whisk together honey and gochujang.',
          duration: 60, // in seconds
          ingredients: ['honey', 'gochujang']
        },
        {
          content: 'Mix together with dried squid using gloved hands.',
          duration: 60, // in seconds
          ingredients: ['dried squid']
        }
      ]
    }
  ]
};

let recipes = [];

const DEFAULT_RECIPE = _clone(KIMCHI_RECIPE); // no id set

const EMPTY_RECIPE = {
  name: '',
  img: '',
  source: '',
  category: '',
  servings: 0,
  ingredients: [ {} ],
  directions: [ {} ]
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
  DEFAULT_RECIPE,

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

    console.log('recipe state loaded', loadedRecipes, loadedRecipesIndex, listeners);
    RecipesState.alertListeners();
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

    render() {
      return (
        <WrappedComponent recipes={this.state.recipes}
                          recipesIndex={this.state.recipesIndex}
                          {...this.props}/>
      );
    }
  };
}

module.exports = { withRecipes, RecipesState, EMPTY_RECIPE, EMPTY_INGREDIENT};
