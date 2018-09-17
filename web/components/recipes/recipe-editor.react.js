import React from 'react';
import ReactDOM from 'react-dom';

import PropTypes from 'prop-types';

import RepeatableComponent from 'components/common/repeatable-component.react';
import TextInput from 'components/common/text-input.react';

import RecipeCard from 'components/recipes/recipe-card.react';
import IngredientsEditor from 'components/recipes/ingredients/ingredients-editor.react';
import DirectionsEditor from 'components/recipes/directions/directions-editor.react';

import { withRecipes, EMPTY_RECIPE } from 'state/RecipesState';

import ApiWrapper from 'util/api-wrapper';
import LocalStorageUtil from 'util/local-storage-util';
import InputUtil from 'util/input-util';

import _range from 'lodash/range';
import _uniqueId from 'lodash/uniqueId';
import _isEmpty from 'lodash/isEmpty';
import _isEqual from 'lodash/isEqual';
import _clone from 'lodash/clone';
import _startCase from 'lodash/startCase';

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

    let showSavedRecipeAlert = false;
    const id = props.match.params.id;
    let loading = id ? true : false;
    let recipe = _clone(EMPTY_RECIPE);
    if (id) {
      recipe = props.recipesIndex[id];
      if (!_isEmpty(recipe)) {
        loading = false;
      }
    } else {
      const savedRecipe = null; //LocalStorageUtil.getNewRecipeBeingEdited();
      console.log('recipe from local storage:', savedRecipe);
      if (!_isEmpty(savedRecipe)) {
        showSavedRecipeAlert = true;
        recipe = savedRecipe;
      }
    }
    recipe = this.assignIds(recipe);

    this.state = {
      recipe,
      loading,
      preview: false,
      showSavedRecipeAlert
    }
  }

  assignIds = (recipe) => {
    // have to give sections & items fake ids for correct react rendering
    recipe.ingredients.forEach((section) => {
      section.id = _uniqueId();
      if (section.items) {
        section.items.forEach((item) => {
          item.id = _uniqueId();
        });
      }
    });

    recipe.directions.forEach((section) => {
      section.id = _uniqueId();
      if (section.steps) {
        section.steps.forEach((step) => {
          step.id = _uniqueId();
        });
      }
    });
    return recipe;
  }

  componentDidUpdate(prevProps) {
    const id = this.props.match.params.id;
    if (id &&
      !_isEmpty(this.props.recipesIndex[id]) &&
      !_isEqual(this.props.recipesIndex[id], prevProps.recipesIndex[id])
    ) {
        let recipe = this.props.recipesIndex[id];
        recipe = this.assignIds(recipe);
        this.setState({ recipe, loading: false });
    }

    // wth is this for ???
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

  handleRecipeInputUpdate = (field, transform=null) => {
    return (ev) => {
      this.setRecipeField(field, transform, ev.target.value);
    }
  }

  handleRecipeUpdate = (field, transform=null) => {
    return (value) => {
      this.setRecipeField(field, transform, value);
    }
  }

  setRecipeField = (field, transform, value) => {
    let recipe = this.state.recipe;
    const newValue = transform ? transform(value) : value;
    recipe[field] = newValue;
    // TODO: why do I need this again?
    LocalStorageUtil.saveNewRecipeBeingEdited(recipe);
    this.setState({ recipe });
  }

  recipeInput = (key, transform=null) =>
    <TextInput labelText={ _startCase(key) }
               value={ this.state.recipe[key] }
               onChange={ this.handleRecipeInputUpdate(key, transform) }/>

  render() {
    // TODO: add a "split" option for ingredients?
    console.log('recipe-editor render', this.state.recipe, this.state.loading);
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
        { this.recipeInput('name') }
        { this.recipeInput('servings', parseInt) }
        { this.recipeInput('source') }
        { this.recipeInput('category') }

        <IngredientsEditor
          updateIngredients={ this.handleRecipeUpdate('ingredients') }
          ingredients={recipe.ingredients}/>

        <DirectionsEditor
          updateDirections={ this.handleRecipeUpdate('directions') }
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
          <div className="ten wide column">{ form }</div>
          <div className="six wide column">{ preview }</div>
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

export default withRecipes(RecipeEditor);
