 import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import RecipeCard from 'components/recipes/recipe-card.react';
import RecipesState from 'state/RecipesState';

import _concat from 'lodash/concat';
import _noop from 'lodash/noop';

import 'sass/recipes/list.scss';

class ApiRecipesList extends React.Component {

  constructor(props) {
    super(props);
    this.onEditClick = this.onEditClick.bind(this);
    this.onCardClick = this.onCardClick.bind(this);
    this.onAddClick = this.onAddClick.bind(this);

    this.state = {
      recipes: []
    }
  }

  componentWillMount() {
    RecipesState.getRecipes()
      .done((recipes) => this.setState({ recipes }));
  }

  onEditClick(i) {
    return () => {
      const recipe = this.state.recipes[i];
      this.props.history.push(`/recipes/r/${recipe._id}/edit`);
    }
  }

  onCardClick(i) {
    return () => {
      //console.log(i);
      const recipes = this.state.recipes;
      const before = recipes.slice(0, i+1);
      const after = recipes.slice(i+1);
      //console.log(before, after);
      this.setState({ recipes: _concat(after, before) });
    }
  }

  onAddClick(i) {
    return () => {
      const recipes = this.state.recipes;
      const recipe = recipes[i];
      this.props.addRecipeToList(recipe);
    }
  }

  onExpandClick(i) {
    return () => {
      const recipe = this.state.recipes[i];
      this.props.history.push(`/recipes/r/${recipe._id}`);
    }
  }

  render() {
    console.log(this.state.recipes);
    const recipeCards = this.state.recipes.map((recipe, i) =>
      <RecipeCard recipe={recipe}
                  key={i}
                  onExpandClick={this.onExpandClick(i)}
                  onAddClick={this.onAddClick(i)}
                  onEditClick={this.onEditClick(i)}
                  onCardClick={this.onCardClick(i)}/>
    );

    return (
      <div className="api-recipes-list">
        { recipeCards }
      </div>
    );
  }
}

ApiRecipesList.propTypes = {
  addRecipeToList: PropTypes.func
}

ApiRecipesList.defaultProps = {
  addRecipeToList: _noop
}

export default withRouter(ApiRecipesList);
