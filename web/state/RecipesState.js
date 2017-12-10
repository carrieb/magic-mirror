import _clone from 'lodash/clone';
import _uniqueId from 'lodash/uniqueId';
import _find from 'lodash/find';

import ApiWrapper from 'util/api-wrapper';

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

recipes.forEach((recipe) => recipe.id = _uniqueId());
// TODO: fill in for recipe db ids

const RecipesState = {
  DEFAULT_RECIPE,
  getRecipes() {
    return ApiWrapper.getRecipeCatalog()
      .then((catalog) => {
        recipes = catalog;
        return catalog;
      });
  },

  getRecipeById(id) {
    const found = _find(recipes, ['id', id]);
    console.log(found);
    return found;
  }
};

export default RecipesState;
