import React from 'react';
import ReactDOM from 'react-dom';

import PropTypes from 'prop-types';

import RepeatableComponent from 'components/common/repeatable-component.react';

import RecipeCard from 'components/recipes/recipe-card.react';
import IngredientsEditor from 'components/recipes/ingredients/ingredients-editor.react';
import DirectionsEditor from 'components/recipes/directions/directions-editor.react';

import RecipesState from 'state/RecipesState';

import ApiWrapper from 'util/api-wrapper';

import _range from 'lodash/range';
import _uniqueId from 'lodash/uniqueId';
import _isEmpty from 'lodash/isEmpty';

class DirectionsFields extends React.Component {
  render() {
    return <div className="directions-fields">
      <div className="ui field">
        <label>Direction Content</label>
        <textarea rows="2"/>
      </div>
    </div>;
  }
}

class ApiAddRecipeForm extends React.Component {
  constructor(props) {
    super(props);


    this.updateDirections = this.updateDirections.bind(this);
    this.saveRecipe = this.saveRecipe.bind(this);

    this.state = {
      recipe: null
    }
  }

  componentWillMount() {
    const id = this.props.match.params.id;
    RecipesState.getRecipeById(id)
      .done((recipe) => {
        recipe.ingredients.forEach((section) => {
          section.id = _uniqueId();
          section.items.forEach((item) => {
            item.id = _uniqueId();
          });
        });
        recipe.directions.forEach((section) => {
          section.id = _uniqueId();
          section.steps.forEach((step) => {
            step.id = _uniqueId();
          })
        });
        this.setState({ recipe });
      })
  }

  componentDidUpdate() {
    $('textarea').each(function () {
      this.setAttribute('style', 'height:' + (this.scrollHeight) + 'px;overflow-y:hidden;');
    }).on('input', function () {
      this.style.height = 'auto';
      this.style.height = (this.scrollHeight) + 'px';
    });
  }

  addIngedientsSection(ev) {
    let recipe = this.state.recipe;
    recipe.ingredients.push([{}]);
    this.setState({ recipe })
  }

  addDirectionsSection(ev) {
    let recipe = this.state.recipe;
    recipe.directions.push([{}]);
    this.setState({ directionsSections: this.state.directionsSections + 1}, recipe)
  }

  saveRecipe() {
    console.log(this.state.recipe);
    ApiWrapper.uploadRecipe(this.state.recipe)
      .done(() => console.log('ok'));
  }

  handleFormRef(ref) {
    this.formRef = ReactDOM.findDOMNode(ref);
  }

  updateIngredients(ingredients) {
    console.log(ingredients);
    const recipe = this.state.recipe;
    recipe.ingredients = ingredients;
    this.setState({ recipe });
  }

  updateDirections(directions) {
    console.log(directions);
    const recipe = this.state.recipe;
    recipe.directions = directions;
    this.setState({ recipe });
  }

  handleNameChange(ev) {
    let recipe = this.state.recipe;
    recipe.name = ev.target.value;
    this.setState({ recipe });
  }

  updateServings(ev) {
    let recipe = this.state.recipe;
    recipe.servings = parseInt(ev.target.value);
    this.setState({ recipe });
  }

  updateSource(ev) {
    let recipe = this.state.recipe;
    recipe.source = ev.target.value;
    this.setState({ recipe });
  }

  render() {
    //console.log(this.state.recipe);
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

    const form = (
      <form className="ui form" ref={(ref) => this.handleFormRef(ref)}>
        <div className="field">
          <label>Recipe Name</label>
          <input type="text" name="name"
            value={this.state.recipe.name} onChange={(ev) => this.handleNameChange(ev)}/>
        </div>

        <div className="field">
          <label>Servings</label>
          <input type="number"
            value={this.state.recipe.servings} onChange={(ev) => this.updateServings(ev)}/>
        </div>

        <div className="field">
          <label>Source</label>
          <input type="text"
            value={this.state.recipe.source} onChange={(ev) => this.updateSource(ev)}/>
        </div>

        <IngredientsEditor
          updateIngredients={(ingr) => this.updateIngredients(ingr)}
          ingredients={this.state.recipe.ingredients}/>

        <DirectionsEditor
          updateDirections={this.updateDirections}
          directions={this.state.recipe.directions}/>

        <button className="ui purple huge fluid button"
                type="button"
                onClick={this.saveRecipe}>
          Save Recipe
        </button>
      </form>
    );

    let preview = (
      <div className="recipe-preview">
        <RecipeCard recipe={this.state.recipe} showImage={false} enableCollapse={false} showActions={false}/>
      </div>
    );

    return (
      <div className="api-add-recipe-form">
        <div className="ui two column grid">
          <div className="eight wide column">{ form }</div>
          <div className="eight wide column">{ preview }</div>
        </div>
      </div>
    );
  }
}

export default ApiAddRecipeForm;
