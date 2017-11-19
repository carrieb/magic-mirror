import _clone from 'lodash/clone';

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

const recipes = [
  KIMCHI_RECIPE,
  SPINACH_GRATIN
];

const RecipesState = {
  DEFAULT_RECIPE: _clone(KIMCHI_RECIPE),
  recipes
};

export default RecipesState;
