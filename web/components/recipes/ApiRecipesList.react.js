import React from 'react';
import { withRouter } from 'react-router-dom';

import RecipeCard from 'components/recipes/recipe-card.react';
import RecipesState from 'state/RecipesState';

import 'sass/recipes/list.scss';

class ApiRecipesList extends React.Component {

  constructor(props) {
    super(props);
    this.onEditClick = this.onEditClick.bind(this);

    this.state = {
      recipes: RecipesState.recipes
    }
  }

  onEditClick(i) {
    return () => {
      const recipe = this.state.recipes[i];
      this.props.history.push(`/recipes/edit/${recipe.id}`);
    }
  }

  render() {
    const recipeCards = this.state.recipes.map((recipe, i) =>
      <RecipeCard recipe={recipe} key={i} onEditClick={this.onEditClick(i)}/>
    );
    return (
      <div className="ui cards api-recipes-list">
        { recipeCards }
      </div>
    );
  }
}

export default withRouter(ApiRecipesList);
