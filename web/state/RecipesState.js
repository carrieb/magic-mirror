const recipes = [
  {
    name: "Testing",
    ingredients: [
      {
        items: [
          {
            name: 'apples',
            quantity: '2'
          },
          {
            name: 'flour',
            quantity: '1 cup'
          }
        ]
      }
    ],
    directions: [
      {
        steps: [
          { content: 'Peel and core the apples' }
        ]
      }
    ]
  }
]

const RecipesState = {
  recipes
};

export default RecipesState;
