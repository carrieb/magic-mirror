import React from 'react';
import { withRouter } from 'react-router-dom';

import RecipesState from 'state/RecipesState';

import Directions from 'components/recipes/directions/directions-display.react';
import Ingredients from 'components/recipes/ingredients/ingredients-display.react';

import _isEmpty from 'lodash/isEmpty';

import 'sass/recipes/full-recipe-view.scss';

class FullRecipeView extends React.Component {
  constructor(props) {
    super(props);
    this.edit = this.edit.bind(this);

    this.state = { recipe: null };
  }

  componentWillMount() {
    const id = this.props.match.params.id;
    RecipesState.getRecipeById(id)
      .done((recipe) => this.setState({ recipe }));
  }

  componentDidUpdate() {
    if (this.state.recipe.source) {
      $('.ui.embed').embed();
    }
  }

  edit() {
    this.props.history.push(`/recipes/${this.props.match.params.id}/edit`);
  }

  render() {
    const recipe = this.state.recipe || {};
    if (_isEmpty(recipe)) {
      return (
        <div className="ui segment">
          <div className="ui active dimmer">
            <div className="ui small text loader">Loading</div>
          </div>
          <p></p>
        </div>
      );
    }

    return (
      <div className="full-recipe-view">
        <div className="ui segment">

          <h1>{recipe.name}<span className="right floated" onClick={this.edit}><i className="ui edit icon"/></span></h1>
          { recipe.source && <div className="ui embed" data-url={recipe.source}/> }
          <Ingredients ingredients={recipe.ingredients}/>
          <Directions directions={recipe.directions} ingredients={recipe.ingredients}/>
        </div>
      </div>
    );
  }
}

export default withRouter(FullRecipeView);
