import React from 'react';
import PropTypes from 'prop-types';

import { withRecipes } from 'state/RecipesState';

import { tr } from 'util/translation-util';

import _isEmpty from 'lodash/isEmpty';

const PlaceholderListItem = () => (
  <div className="ui item">
    <div className="image">
      <div className="ui placeholder">
        <div className="square image"/>
      </div>
    </div>

    <div className="content">
      <div className="ui placeholder">
        <div className="header">
          <div className="short line"/>
        </div>

        <div className="paragraph">
          <div className="long line"/>
        </div>

        <div className="paragraph">
          <div className="long line"/>
          <div className="long line"/>
          <div className="medium line"/>
        </div>
      </div>
    </div>
  </div>
);

class RecipeListItem extends React.Component {
  render() {
    if (this.props.recipes.length === 0) {
      return <PlaceholderListItem/>;
    }

    const recipe = this.props.recipesIndex[this.props.id];
    if (_isEmpty(recipe)) {
      return <PlaceholderListItem/>
    }

    const nameText = tr(`recipes.names.${recipe.name}`);
    const categoryText = tr(`recipes.categories.${recipe.category}`);
    const servingsText = tr('recipes.text.servings', { smart_count: recipe.servings }, true);

    return (
      <div className="ui item">
        { recipe.img && <div className="image">
          <img src={recipe.img}/>
        </div> }
        <div className="content">
          <div className="header">
            <a href={`/recipes/r/${recipe._id}`}>{ nameText }</a>
          </div>
          <div className="meta">
            { categoryText } | { servingsText }
          </div>
          <div className="description">
          </div>
        </div>
      </div>
    )
  }
}

RecipeListItem.propTypes = {
  id: PropTypes.string
}

export default withRecipes(RecipeListItem);
