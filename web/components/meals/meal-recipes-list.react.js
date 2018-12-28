import React from 'react';

import RecipeListItem from 'components/recipes/recipe-list-item.react';

import _isEmpty from 'lodash/isEmpty';

class MealsRecipeList extends React.Component {
  render() {
    let content = this.props.ids.map(id => <RecipeListItem id={id} key={id}/>);
    return (
      <div className="ui divided items meal-recipes">
        { content }
      </div>
    );
  }
}

export default MealsRecipeList;
