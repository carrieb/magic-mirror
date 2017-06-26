import React from 'react';
import ReactDOM from 'react-dom';

import PropTypes from 'prop-types';

import RepeatableComponent from 'components/common/repeatable-component.react';

import _range from 'lodash/range';

class IngredientFields extends React.Component {
  handleChange(ev, field) {
    console.log(ev);
    if (this.props.onChange) {
      this.props.onChange(field, ev.target.value)
    }

  }

  render() {
    return <div className="ingredients-fields">
      <div className="ui field">
        <label>Name</label>
        <input type="text" onChange={(ev) => this.handleChange(ev, 'name')}/>
      </div>
    </div>;
  }
}

IngredientFields.propTypes = {
  index: PropTypes.number.isRequired,
  onChange: PropTypes.func
}


// TODO: pass in an onChange

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
      directionsSections: 1,
      recipe: {
        ingredients: [ [ {} ] ],
        directions: [ [ {} ] ]
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

  updateIngredients(sectionIndex, index, field, value) {
    let ingredientsList = this.state.recipe.ingredients[sectionIndex];
    ingredientsList[index][field] = value;
    this.setState({
      ingredientsList
    });
  }

  addIngredient(idx) {
    let ingredientsList = this.state.recipe.ingredients[idx];
    ingredientsList.push({ })
  }

  deleteIngredient(idx) {
    // TODO:
  }

  render() {
    console.log(this.state.recipe);
    const ingredientsSections = this.state.recipe.ingredients.map((ingredientsList, idx) => {
      const nameField = (
        <div className="ui field">
          <label>Ingredients Section Name</label>
          <input type="text" name={`ingredients[${idx}].name`} placeholder="default"/>
        </div>
      );
      const moreThanOneSection = this.state.recipe.ingredients.length > 1;
      return (
        <div key={idx} className="ingredients-section">
          { moreThanOneSection && nameField }
          { moreThanOneSection && <div className="ui sub header">Ingredients</div>}
          <RepeatableComponent
            component={IngredientFields}
            onChange={(index, field, value) => this.updateIngredients(idx, index, field, value)}
            onAdd={() => this.addIngredient(idx)}
            onDelete={(index) => this.deleteIngredient(idx, index)}
          />
        </div>
      );
    });
    const directionsSections = _range(this.state.directionsSections).map((idx) => {
      return (
        <div key={idx} className="directions-section">
          <RepeatableComponent component={DirectionsFields}/>
        </div>
      );
    });
    return (
      <div className="api-add-recipe-form">
        <form className="ui form" ref={(ref) => this.handleFormRef(ref)}>
          <div className="field">
            <label>Recipe Name</label>
            <input type="text" name="name"/>
          </div>

          <h3 className="ui header">Ingredients</h3>
          {ingredientsSections}
          <button
            className="ui olive mini fluid button"
            type="button"
            onClick={() => this.addIngedientsSection()}>
              Add Ingredients Section
          </button>

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
      </div>
    );
  }
}

export default ApiAddRecipeForm;
