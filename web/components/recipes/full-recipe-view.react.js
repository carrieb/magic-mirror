import React from 'react';
import { withRouter } from 'react-router-dom';

import { withRecipes } from 'state/RecipesState';

import Directions from 'components/recipes/directions/directions-display.react';
import Ingredients from 'components/recipes/ingredients/ingredients-display.react';
//import Timeline from 'components/recipes/timeline/timeline.react';

import _isEmpty from 'lodash/isEmpty';
import _isEqual from 'lodash/isEqual';

import 'sass/recipes/full-recipe-view.scss';

class FullRecipeView extends React.Component {
  componentDidUpdate() {
    const id = this.props.match.params.id;
    const recipe = this.props.recipesIndex[id];
    if (recipe && recipe.source) {
      $('.ui.embed').embed();
    }
  }

  edit() {
    this.props.history.push(`/recipes/r/${this.props.match.params.id}/edit`);
  }

  render() {
    const id = this.props.match.params.id;
    const recipe = this.props.recipesIndex[id];

    if (_isEmpty(recipe)) {
      return (
        <div className="ui segment">
          <div className="ui active dimmer">
            <div className="ui small text loader">Loading...</div>
          </div>
          <p></p>
        </div>
      );
    }

    return (
      <div className="full-recipe-view">
        <div className="ui segment">

          <h3>
            <span className="right floated" onClick={this.edit}><i className="ui edit outline icon"/></span>
            {recipe.name}
          </h3>

          { recipe.img && <div className="ui image"><img src={recipe.img}/></div> }
          { recipe.source && recipe.source.indexOf('youtube.com') > -1 && <div className="ui embed" data-url={recipe.source}/> }

          <Ingredients ingredients={recipe.ingredients}/>
          <Directions directions={recipe.directions} ingredients={recipe.ingredients}/>
          { false && <Timeline directions={recipe.directions}/> }
        </div>
      </div>
    );
  }
}

export default withRouter(withRecipes(FullRecipeView));
