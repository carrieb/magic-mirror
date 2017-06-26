import React from 'react';

class ApiRecipesList extends React.Component {

  constructor(props) {
    super(props);
    // TODO: update to using RecipeState
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
    ];
    this.state = {
      recipes
    }
  }

  render() {
    const recipeCards = this.state.recipes.map((recipe, i) => {
      const ingredients = recipe.ingredients.map((ingredientsList, j) => {
        let title = <div className="ui sub header">{ingredientsList.name ? ingredientsList.name : 'ingredients'}</div>
        let items = ingredientsList.items.map((item, idx) => {
          return <div className="item" key={idx}>{item.quantity} of {item.name}</div>
        });
        return (
          <div className="content" key={j}>
            { title }
            <div className="ui list">
              { items }
            </div>
          </div>
        );
      });
      const directions = recipe.directions.map((directionsList, j) => {
        let title = <div className="ui sub header">{directionsList.name ? directionsList.name : 'directions'}</div>;
        let steps = directionsList.steps.map((step, idx) => {
          return <div className="item" key={idx}>{step.content}</div>
        });
        return (
          <div className="content" key={j}>
            { title }
            <div className="ui list">
              { steps }
            </div>
          </div>
        );
      });
      return (
        <div className="ui card" key={i}>
          <div className="content">
            <div className="header">{recipe.name}</div>
          </div>
          <div className="content">
            { ingredients }
          </div>
          <div className="content">
            { directions }
          </div>
        </div>
      );
    });
    return (
      <div className="api-recipes-list">
        { recipeCards }
      </div>
    );
  }
}

export default ApiRecipesList;
