import React from 'react';
import ReactDOM from 'react-dom';

import PropTypes from 'prop-types';

import RepeatableComponent from 'components/common/repeatable-component.react';

import RecipeCard from 'components/recipes/recipe-card.react';
import IngredientsEditor from 'components/recipes/ingredients/ingredients-editor.react';
import DirectionsEditor from 'components/recipes/directions/directions-editor.react';

import { RecipesState, EMPTY_RECIPE } from 'state/RecipesState';

import ApiWrapper from 'util/api-wrapper';
import LocalStorageUtil from 'util/local-storage-util';

import _range from 'lodash/range';
import _uniqueId from 'lodash/uniqueId';
import _isEmpty from 'lodash/isEmpty';
import _clone from 'lodash/clone';

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

class RecipeEditor extends React.Component {
  constructor(props) {
    super(props);

    const id = props.match.params.id;

    this.state = {
      recipe: _clone(EMPTY_RECIPE),
      loading: id ? true : false,
      preview: id ? true : false,
      showSavedRecipeAlert: false
    }
  }

  componentWillMount() {
    const id = this.props.match.params.id;

    if (id) {
      RecipesState.getRecipeById(id)
        .done((recipe) => {

          // have to give sections & items fake ids for correct react rendering
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
    } else {
      const savedRecipe = LocalStorageUtil.getNewRecipeBeingEdited();
      if (!_isEmpty(savedRecipe)) {
        this.setState({ recipe: savedRecipe, showSavedRecipeAlert: true });
      }
    }
  }

  componentDidUpdate() {
    $('textarea').each(function () {
      this.setAttribute('style', 'height:' + (this.scrollHeight) + 'px;overflow-y:hidden;');
    }).on('input', function () {
      this.style.height = 'auto';
      this.style.height = (this.scrollHeight) + 'px';
    });
  }

  togglePreview = () => {
    this.setState({ preview: !this.state.preview });
  };

  handleFormRef = (ref) => {
    this.formRef = ReactDOM.findDOMNode(ref);
  };

  saveRecipe = () => {
    // TODO: add validation that recipe has fields?
    console.log(this.state.recipe);
    ApiWrapper.uploadRecipe(this.state.recipe)
      .done(() => {
        console.log('ok');
        LocalStorageUtil.saveNewRecipeBeingEdited({});
      });
  };

  addIngedientsSection = (ev) => {
    let recipe = this.state.recipe;
    recipe.ingredients.push([{}]);
    LocalStorageUtil.saveNewRecipeBeingEdited(recipe);
    this.setState({ recipe });
  };

  addDirectionsSection = (ev) => {
    let recipe = this.state.recipe;
    recipe.directions.push([{}]);
    LocalStorageUtil.saveNewRecipeBeingEdited(recipe);
    this.setState({ directionsSections: this.state.directionsSections + 1, recipe })
  };

  updateIngredients = (ingredients) => {
    console.log(ingredients);
    const recipe = this.state.recipe;
    recipe.ingredients = ingredients;
    LocalStorageUtil.saveNewRecipeBeingEdited(recipe);
    this.setState({ recipe });
  };

  updateDirections = (directions) => {
    console.log(directions);
    const recipe = this.state.recipe;
    recipe.directions = directions;
    LocalStorageUtil.saveNewRecipeBeingEdited(recipe);
    this.setState({ recipe });
  };

  handleNameChange = (ev) => {
    let recipe = this.state.recipe;
    recipe.name = ev.target.value;
    LocalStorageUtil.saveNewRecipeBeingEdited(recipe);
    this.setState({ recipe });
  };

  updateServings = (ev) => {
    let recipe = this.state.recipe;
    recipe.servings = parseInt(ev.target.value);
    LocalStorageUtil.saveNewRecipeBeingEdited(recipe);
    this.setState({ recipe });
  };

  updateSource = (ev) => {
    let recipe = this.state.recipe;
    recipe.source = ev.target.value;
    LocalStorageUtil.saveNewRecipeBeingEdited(recipe);
    this.setState({ recipe });
  };

  render() {
    console.log(this.state.recipe);
    const recipe = this.state.recipe;

    if (this.state.loading) {
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
      <form className="ui form" ref={this.handleFormRef}>
        <div className="field">
          <label>Recipe Name</label>
          <input type="text" name="name"
            value={recipe.name} onChange={this.handleNameChange}/>
        </div>

        <div className="field">
          <label>Servings</label>
          <input type="number"
            value={recipe.servings} onChange={this.updateServings}/>
        </div>

        <div className="field">
          <label>Source</label>
          <input type="text"
            value={recipe.source} onChange={this.updateSource}/>
        </div>

        <IngredientsEditor
          updateIngredients={this.updateIngredients}
          ingredients={recipe.ingredients}/>

        <DirectionsEditor
          updateDirections={this.updateDirections}
          directions={recipe.directions}/>

        <button className="ui purple huge fluid button"
                type="button"
                onClick={this.saveRecipe}>
          Save Recipe
        </button>
      </form>
    );

    // TODO: make showing preview toggle-able
    let preview = (
      <div className="recipe-preview">
        <RecipeCard recipe={recipe} showImage={false} enableCollapse={false} showActions={false}/>
        <button className="ui button" onClick={this.togglePreview}>Hide Preview</button>
      </div>
    );

    let content;
    if (this.state.preview) {
      content = (
        <div className="ui two column grid">
          <div className="eight wide column">{ form }</div>
          <div className="eight wide column">{ preview }</div>
        </div>
      );
    } else {
      content = (
        <div>
          { form }
          <button className="ui button" onClick={this.togglePreview}>Show Preview Card</button>
        </div>
      );
    }

    return (
      <div className="recipe-editor">
        { this.state.showSavedRecipeAlert && <div className="ui positive message">
            <i className="close icon"/>
            <div className="header">Using saved recipe.</div>
            <p>Recipe data loaded from your last incomplete editor session.</p>
          </div> }
        { content }
      </div>
    );
  }
}

export default RecipeEditor;
