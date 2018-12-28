import React from 'react';
import ReactDOM from 'react-dom';

import PropTypes from 'prop-types';

import RepeatableComponent from 'components/common/repeatable-component.react';
import TextInput from 'components/common/text-input.react';
import TagsInput from 'components/common/tags-input.react';
import StickyHeaderMenu from 'components/common/sticky-header-menu.react';

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

import 'sass/recipes/recipe-editor.scss';

class RecipeEditor extends React.Component {
  constructor(props) {
    super(props);

    // start with empty recipe
    let recipe = _clone(EMPTY_RECIPE);
    let showSavedRecipeAlert = false;

    // attempt to load from index
    const id = props.match.params.id;
    const recipeFromIndex = props.recipesIndex[id];
    let loading = (id && _isEmpty(recipeFromIndex)) ? true : false;

    if (id && !loading) {
      recipe = recipeFromIndex;
    }

    // if new recipe, get state from editor
    if (!id) {
      const savedRecipe = LocalStorageUtil.getNewRecipeBeingEdited();
      console.log('recipe from local storage:', savedRecipe);
      if (!_isEmpty(savedRecipe)) {
        showSavedRecipeAlert = true;
        recipe = this.assignIds(savedRecipe);
      }
    }

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

  componentDidMount() {
    $('.message .close')
      .on('click', function() {
        $(this)
          .closest('.message')
          .transition('fade')
        ;
      });

    $('.field.img input').popup({
      position: 'bottom center',
      inline: true
    });
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

    $('.field.img input').popup({
      position: 'bottom center',
      inline: true
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
        // TODO: actually clear out recipe being edited if id not set on url
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
    if (!this.props.match.params.id) {
      LocalStorageUtil.saveNewRecipeBeingEdited(recipe);
    }
    this.setState({ recipe });
  }

  recipeInput = (key, transform=null, extra=null) => {
    //console.log(key, extra);
    return <TextInput labelText={ _startCase(key) }
               className={ key }
               value={ this.state.recipe[key] }
               onChange={ this.handleRecipeInputUpdate(key, transform) }>
       { extra }
    </TextInput>;
  }


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
        <div className="field">
          <div className="two fields">
            { this.recipeInput('servings', parseInt) }
            { this.recipeInput('category') }
          </div>
        </div>
        <TagsInput onChange={ this.handleRecipeUpdate('tags') } values={this.state.recipe.tags}/>
        { this.recipeInput('source') }
        { this.recipeInput('img', null, <div className="ui popup">
          <img src={this.state.recipe.img} style={{ maxWidth: '500px', height: 'auto' }}/>
        </div>) }

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
      </div>
    );

    let content = form;
    if (this.state.preview) {
      content = (
        <div className="ui two column grid">
          <div className="ten wide column">{ form }</div>
          <div className="six wide column">{ preview }</div>
        </div>
      );
    }

    // TODO: add image upload
    console.log(LocalStorageUtil.getNewRecipeBeingEdited());

    return (
      <div className="ui basic segment recipe-editor" style={{ padding: 0 }}>
        { this.state.showSavedRecipeAlert && <div className="ui icon positive close message">
            <i className="exclamation circle icon"/>
            <i className="close icon"/>
            <div className="content">
              <div className="header">Using saved recipe.</div>
              <p>Recipe data loaded from your last incomplete editor session.</p>
            </div>
          </div> }
        <StickyHeaderMenu>
          <button className="ui basic teal button" onClick={this.togglePreview}>
            { this.state.preview ? 'Hide Preview Card' : 'Show Preview Card' }
          </button>
        </StickyHeaderMenu>
        { content }
      </div>
    );
  }
}

export default withRecipes(RecipeEditor);
