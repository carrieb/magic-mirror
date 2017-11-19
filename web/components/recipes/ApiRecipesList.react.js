import React from 'react';

import RecipeCard from 'components/recipes/recipe-card.react';
import RecipesState from 'state/RecipesState';

import 'sass/recipes/list.scss';

class ApiRecipesList extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      recipes: RecipesState.recipes
    }
  }

  render() {
    const recipeCards = this.state.recipes.map((recipe, i) =>
      <RecipeCard recipe={recipe} key={i}/>
    );
    return (
      <div className="ui cards api-recipes-list">
        { recipeCards }
      </div>
    );
  }
}

export default ApiRecipesList;
