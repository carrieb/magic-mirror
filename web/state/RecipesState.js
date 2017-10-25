const DEFAULT_RECIPE = {
  name: 'Honey-Kimchi Dried Squid',
  img: '/images/recipes/kimchi.JPG',
  ingredients: [
    {
      items: [
        {
          name: 'dried squid',
          quantity: '1 pkg'
        },
        {
          name: 'honey',
          quantity: '1 quarter cup'
        },
        {
          name: 'gochujang',
          quantity: '1 quarter cup'
        }
      ]
    }
  ],
  directions: [
    {
      steps: [
        {
          content: 'Whisk together honey and gochujang.',
          duration: 60 // in seconds
        },
        {
          content: 'Mix together with dried squid using gloved hands.',
          duration: 60 // in seconds
        }
      ]
    }
  ]
};

const recipes = [
  DEFAULT_RECIPE
];

const RecipesState = {
  DEFAULT_RECIPE,
  recipes
};

export default RecipesState;
