import _clone from 'lodash/clone';
import _uniqueId from 'lodash/uniqueId';
import _find from 'lodash/find';

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

const SPINACH_GRATIN = {
  name: 'Spinach Gratin',
  img: '/images/recipes/spinach-gratin.jpeg',
  servings: 8,
  ingredients: [
    {
      items: [
        {
          name: 'frozen spinach',
          quantity: { amount: 5, unit: 'pkg' },
          modifier: 'defrosted'
        },
        {
          name: 'unsalted butter',
          quantity: { amount: 4, unit: 'tbsp' }
        },
        {
          name: 'yellow onions',
          quantity: { amount: 4, unit: 'cup' },
          modifier: 'chopped'
        },
        {
          name: 'flour',
          quantity: { amount: 1, unit: 'quarter cup' }
        },
        {
          name: 'nutmeg',
          quantity: { amount: .25, unit: 'tsp' }
        },
        {
          name: 'milk',
          quantity: { amount: 2, unit: 'cup' }
        },
        {
          name: 'heavy cream',
          quantity: { amount: 1, unit: 'cup' }
        },
        {
          name: 'parmesean',
          quantity: { amount: 1, unit: 'cup' },
          modifier: 'grated'
        },
        {
          name: 'kosher salt',
          quantity: { amount: 1, unit: 'tsp' }
        },
        {
          name: 'pepper',
          quantity: { amount: .5, unit: 'tsp' }
        },
        {
          name: 'guyere cheese',
          quantity: { amount: .25, unit: 'cup' },
          modifier: 'grated'
        }
      ]
    }
  ],
  directions: [
    {
      steps: [
        {
          content: 'Preheat oven to 425 degrees.',
          duration: 60 * 5 // in seconds
        },
        {
          content: 'Melt the butter in a heavy-bottomed saute pan over medium heat.',
          duration: 60 // in seconds
        },
        {
          content: 'Add the onions and saute until translucent, about 15 minutes.',
          duration: 60 * 15 // in seconds
        },
        {
          content: 'Add the flour and nutmeg and cook, stirring, for 2 more minutes. ',
          duration: 60 * 2 // in seconds
        },
        {
          content: 'Add the cream and milk and cook until thickened.',
          duration: 60 * 5 // in seconds
        },
        {
          content: 'Squeeze as much liquid as possible from the spinach and add the spinach to the sauce.',
          duration: 60 // in seconds
        },
        {
          content: 'Add 1/2 cup of the Parmesan cheese and mix well.',
          duration: 60 // in seconds
        },
        {
          content: 'Season, to taste, with salt and pepper. ',
          duration: 60 // in seconds
        },
        {
          content: 'Transfer the spinach to a baking dish and sprinkle the remaining 1/2 cup Parmesan and the Gruyere on top.',
          duration: 60 // in seconds
        },
        {
          content: 'Bake for 20 minutes until hot and bubbly.',
          duration: 60 * 20 // in seconds
        }
      ]
    }
  ]
}

const CRANAPPLE_CAKE = {
  name: 'Cranberry Apple Cake with Cream Cheese Frosting',
  img: '/images/recipes/cranberry-apple-cake.jpg',
  servings:  12,
  ingredients: [
    {
      name: 'cranberry apple cake',
      items: [
        {
          name: 'flour',
          quantity: { amount: 3, unit: 'cup' },
          modifier: 'all-purpose'
        },
        {
          name: 'baking powder',
          quantity: { amount: 1.5, unit: 'tsp' }
        },
        {
          name: 'baking soda',
          quantity: { amount: .5, unit: 'tsp' },
          modifier: 'chopped'
        },
        {
          name: 'cinnamon',
          quantity: { amount: 1.5, unit: 'tsp' },
          modifier: 'ground'
        },
        {
          name: 'nutmeg',
          quantity: { amount: .5, unit: 'tsp' },
          modifier: 'ground'
        },
        {
          name: 'cloves',
          quantity: { amount: .25, unit: 'tsp' },
          modifier: 'ground'
        },
        {
          name: 'allspice',
          quantity: { amount: .25, unit: 'tsp' },
          modifier: 'ground'
        },
        {
          name: 'salt',
          quantity: { amount: 1, unit: 'tsp' }
        },
        {
          name: 'vegetable oil',
          quantity: { amount: 1, unit: 'cup' }
        },
        {
          name: 'sugar',
          quantity: { amount: 2, unit: 'cup' }
        },
        {
          name: 'vanilla extract',
          quantity: { amount: 2, unit: 'tsp' }
        },
        {
          name: 'eggs',
          quantity: { amount: 4 },
          modifier: 'room temerpature'
        },
        {
          name: 'buttermilk',
          quantity: { amount: 1, unit: 'cup' },
          modifier: 'room temperature'
        },
        {
          name: 'cranberries',
          quantity: { amount: 1, unit: 'cup' },
          modifier: 'halved'
        },
        {
          name: 'apples',
          quantity: { amount: 2, unit: 'cup' },
          modifier: 'peeled and diced'
        }
      ]
    },
    {
      name: 'cranberry apple pie filling',
      items: [
        {
          name: 'cranberries',
          quantity: { amount: 1, unit: 'cup' },
          modifier: 'halved'
        },
        {
          name: 'apples',
          quantity: { amount: 2, unit: 'cup' },
          modifier: 'peeled and diced'
        },
        {
          name: 'brown sugar',
          quantity: { amount: .33, unit: 'cup' }
        },
        {
          name: 'cinnamon',
          quantity: { amount: 0.5, unit: 'tsp' },
          modifier: 'ground'
        },
        {
          name: 'nutmeg',
          quantity: { amount: 1, unit: 'dash' },
          modifier: 'ground'
        },
        {
          name: 'cloves',
          quantity: { amount: 1, unit: 'dash' },
          modifier: 'ground'
        },
        {
          name: 'allspice',
          quantity: { amount: 1, unit: 'dash' },
          modifier: 'ground'
        },
        {
          name: 'cornstarch',
          quantity: { amount: 1, unit: 'tsp' }
        },
        {
          name: 'butter',
          quantity: { amount: 1, unit: 'tbsp' }
        }
      ]
    },
    {
      name: 'cream cheese frosting',
      items: [
        {
          name: 'cream cheese',
          quantity: { amount: 8, unit: 'oz' },
          modifier: 'softened'
        },
        {
          name: 'butter',
          quantity: { amount: 0.5, unit: 'cup' },
          modifier: 'softened'
        },
        {
          name: 'salt',
          quantity: { amount: 1, unit: 'pinch' }
        },
        {
          name: 'vanilla extract',
          quantity: { amount: 1, unit: 'tsp' }
        },
        {
          name: 'powdered sugar',
          quantity: { amount: 4.5, unit: 'cup' }
        }
      ]
    },
    {
      name: 'sugared cranberries',
      optional: true,
      items: [
        {
          name: 'sugar',
          quantity: { amount: .75, unit: 'cup' }
        },
        {
          name: 'water',
          quantity: { amount: .25, unit: 'cup' }
        },
        {
          name: 'cranberries',
          quantity: { amount: 1, unit: 'cup' }
        }
      ]
    }
  ],
  directions: [
    {
      steps: [
        {
          content: 'Preheat oven to 425 degrees.',
          duration: 60 * 5 // in seconds
        },
        {
          content: 'Melt the butter in a heavy-bottomed saute pan over medium heat.',
          duration: 60 // in seconds
        },
        {
          content: 'Add the onions and saute until translucent, about 15 minutes.',
          duration: 60 * 15 // in seconds
        },
        {
          content: 'Add the flour and nutmeg and cook, stirring, for 2 more minutes. ',
          duration: 60 * 2 // in seconds
        },
        {
          content: 'Add the cream and milk and cook until thickened.',
          duration: 60 * 5 // in seconds
        },
        {
          content: 'Squeeze as much liquid as possible from the spinach and add the spinach to the sauce.',
          duration: 60 // in seconds
        },
        {
          content: 'Add 1/2 cup of the Parmesan cheese and mix well.',
          duration: 60 // in seconds
        },
        {
          content: 'Season, to taste, with salt and pepper. ',
          duration: 60 // in seconds
        },
        {
          content: 'Transfer the spinach to a baking dish and sprinkle the remaining 1/2 cup Parmesan and the Gruyere on top.',
          duration: 60 // in seconds
        },
        {
          content: 'Bake for 20 minutes until hot and bubbly.',
          duration: 60 * 20 // in seconds
        }
      ]
    }
  ]
}

const recipes = [
  KIMCHI_RECIPE,
  SPINACH_GRATIN,
  CRANAPPLE_CAKE
];

const DEFAULT_RECIPE = _clone(KIMCHI_RECIPE); // no id set

recipes.forEach((recipe) => recipe.id = _uniqueId());
// TODO: fill in for recipe db ids

const RecipesState = {
  DEFAULT_RECIPE,
  recipes,

  getRecipeById(id) {
    const found = _find(recipes, ['id', id]);
    console.log(found);
    return found;
  }
};

export default RecipesState;
