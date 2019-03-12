import React from 'react';

import { withRecipes } from 'state/RecipesState';

import CategorySearchDropdown from 'components/common/category-search-dropdown.react';

import { tr } from 'util/translation-util';

import _isEmpty from 'lodash/isEmpty';
import _noop from 'lodash/noop';

import 'sass/recipes/search-recipes-by-name-dropdown.scss';

class SearchRecipesByNameDropdown extends React.Component {
  render() {
    return (
      <div className="search-recipes-by-name-dropdown-wrapper">
        <CategorySearchDropdown placeholder={ tr('recipes.text.search_placeholder', {}, true) }
                                loading={ _isEmpty(this.props.recipes) }
                                items={ this.props.recipes.map((recipe) => {
                                  return {
                                    category: !_isEmpty(recipe.category) ? recipe.category : 'Main Dish',
                                    title: recipe.name
                                  };
                                }) }
                                onSelect={ _noop }/>
      </div>
    );
  }
}

export default withRecipes(SearchRecipesByNameDropdown);
