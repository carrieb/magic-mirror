import React from 'react';

import { withRecipes } from 'state/RecipesState';

import { randomColor } from 'util/colors';

import _groupBy from 'lodash/groupBy';
import _without from 'lodash/without';
import _filter from 'lodash/filter';

import 'sass/recipes/filter-recipes-by-category-tags.scss';

const RECIPE_CATEGORIES = [
  'Dessert',
  'Main Dish',
  'Side Dish'
];

const CategoryTag = ({ category, numRecipes, selectedCategories, addCategory }) => {
  const color = randomColor(category);

  return (
    <div className="ui labeled button" onClick={addCategory}>
      <div className={`ui basic ${color} button`}>
        <i className="heart icon"/> { category }
      </div>
      <a className={`ui ${color} left pointing label`}>
        { numRecipes }
      </a>
    </div>
  );
}

const CategoryLabel = ({ category, removeCategory }) => {
  const color = randomColor(category);
  return (
    <div className={`ui ${color} icon buttons`}>
      <div className="ui button">
        <i className="heart icon"/> { category }
      </div>
      <div className={`ui basic ${color} icon button`} onClick={removeCategory}>
        <i className="right close icon"></i>
      </div>
    </div>
  );
}


class FilterRecipesByCategoryTags extends React.Component {
  state = {
    selectedCategories: []
  }

  addCategory = (category) => {
    return () => {
      this.setState({
        selectedCategories: [...this.state.selectedCategories, category]
      });
    }
  }

  removeCategory = (category) => {
    return () => {
      this.setState({
        selectedCategories: _without(this.state.selectedCategories, category)
      });
    }
  }

  render() {
    const { selectedCategories } = this.state;

    const grouped = _groupBy(RECIPE_CATEGORIES, (category) =>
      this.state.selectedCategories.indexOf(category) > -1 ? 'selected' : 'tags');

    const selected = grouped.selected || [];
    const tags = grouped.tags || [];

    const filteredRecipes = this.props.recipes.filter((recipe) => {
      return recipe.category && this.state.selectedCategories.indexOf(recipe.category) > -1;
    });

    console.log(filteredRecipes);

    const categoryTags = tags.map((category) =>
      <CategoryTag category={category}
                   key={category}
                   addCategory={this.addCategory(category)}
                   numRecipes={ _filter(this.props.recipes, { category }).length }/>
    );

    const categoryLabels = selected.map((category) =>
      <CategoryLabel category={category}
                     key={category}
                     removeCategory={this.removeCategory(category)}/>
    );

    return (
      <div className="filter-recipes-by-category-tags">
        { categoryLabels.length > 0 && <div className="ui circular label">{ filteredRecipes.length }</div> }
        { categoryLabels.length > 0 && <div className="selected">{ categoryLabels }</div> }
        { categoryTags.length > 0 && <div>{ categoryTags }</div> }
      </div>
    );
  }
}

export default withRecipes(FilterRecipesByCategoryTags);
