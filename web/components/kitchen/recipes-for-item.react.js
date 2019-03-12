import React from 'react';
import PropTypes from 'prop-types';

import ApiWrapper from 'util/api-wrapper';

import RecipeListItem from 'components/recipes/recipe-list-item.react';

class RecipesForItem extends React.Component {
  state = {
    recipes: []
  };

  componentWillMount() {
    ApiWrapper.searchRecipesByIngredient(this.props.ingredient)
      .done((recipes) => {
        //console.log(recipes);
        this.setState({
          recipes
        });
      });
  }

  render() {
    const recipes = this.state.recipes.map((recipe) => {
      return <RecipeListItem key={recipe._id} id={recipe._id}/>
    });

    return (
      <div className="recipes-for-item">
        <h4 className="ui horizontal divider header">
          Recipes with { this.props.ingredient }
        </h4>
        <div className="ui divided items">
          { recipes }
        </div>
      </div>
    );
  }
}

RecipesForItem.propTypes = {
  ingredient: PropTypes.string.isRequired
};

export default RecipesForItem;
