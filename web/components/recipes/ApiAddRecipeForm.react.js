import React from 'react';
import ReactDOM from 'react-dom';

import PropTypes from 'prop-types';

import RepeatableComponent from 'components/common/repeatable-component.react';

import RecipeCard from 'components/recipes/recipe-card.react';
import IngredientsEditor from 'components/recipes/ingredients/ingredients-editor.react';
import DirectionsEditor from 'components/recipes/directions/DirectionsEditor.react';

import RecipesState from 'state/RecipesState';

import _range from 'lodash/range';

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
    super(props)
    this.updateDirections = this.updateDirections.bind(this);

    this.state = {
      recipe: RecipesState.DEFAULT_RECIPE
    }
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
    console.log($(this.formRef).param());
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

  addIngredient(idx) {
    let ingredientsList = this.state.recipe.ingredients[idx];
    ingredientsList.push({ })
  }

  deleteIngredient(idx) {
    // TODO:
  }

  handleNameChange(ev) {
    let recipe = this.state.recipe;
    recipe.name = ev.target.value;
    this.setState({ recipe });
  }

  render() {
    console.log(this.state.recipe);

    const directionsSections = _range(this.state.directionsSections).map((idx) => {
      return (
        <div key={idx} className="directions-section">
          <RepeatableComponent component={DirectionsFields}
            values={this.state.recipe.directions}/>
        </div>
      );
    });

    const form = (
      <form className="ui form" ref={(ref) => this.handleFormRef(ref)}>
        <div className="field">
          <label>Recipe Name</label>
          <input type="text" name="name"
            value={this.state.recipe.name} onChange={(ev) => this.handleNameChange(ev)}/>
        </div>

        <IngredientsEditor
          updateIngredients={(ingr) => this.updateIngredients(ingr)}
          ingredients={this.state.recipe.ingredients}/>

        <DirectionsEditor
          updateDirections={this.updateDirections}
          directions={this.state.recipe.directions}/>

        <button className="ui red huge fluid button"
                type="button"
                onClick={() => this.saveRecipe()}>
          Save Recipe
        </button>
      </form>
    );

    let preview = (
      <div className="recipe-preview">
        <RecipeCard recipe={this.state.recipe}/>
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
