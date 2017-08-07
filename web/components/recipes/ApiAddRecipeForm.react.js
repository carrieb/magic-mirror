import React from 'react';
import ReactDOM from 'react-dom';

import PropTypes from 'prop-types';

import RepeatableComponent from 'components/common/repeatable-component.react';

import RecipeCard from 'components/recipes/recipe-card.react';
import IngredientsEditor from 'components/recipes/ingredients/ingredients-editor.react';

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

    this.state = {
      recipe: {
        name: '',
        ingredients: [ { items: [ {} ] } ],
        directions: [ { steps: [ {} ] } ]
      }
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
          <RepeatableComponent component={DirectionsFields}/>
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

        <IngredientsEditor updateIngredients={(ingr) => this.updateIngredients(ingr)}
          ingredients={this.state.recipe.ingredients}/>

        <h3 className="ui header">Directions</h3>
        {directionsSections}
        <button className="ui blue mini fluid button"
                type="button"
                onClick={() => this.addDirectionsSection()}>
          Add Directions Section
        </button>

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
        <div className="ui grid">
          <div className="eight wide column">{ form }</div>
          <div className="eight wide column">{ preview }</div>
        </div>
      </div>
    );
  }
}

export default ApiAddRecipeForm;
