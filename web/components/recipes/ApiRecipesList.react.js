import React from 'react';

import RecipeCard from 'components/recipes/recipe-card.react';
import RecipesState from 'state/RecipesState';

class ApiRecipesList extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      recipes: RecipesState.recipes
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
            <div className="ui ordered list">
              { steps }
            </div>
          </div>
        );
      });
      return <RecipeCard recipe={recipe} key={i}/>
    });
    return (
      <div className="api-recipes-list">
        { recipeCards }
      </div>
    );
  }
}

export default ApiRecipesList;
