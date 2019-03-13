import React from 'react';
import PropTypes from 'prop-types';

// TODO: move this to api call
import RecipeParser from 'src/recipe-parser';

import RecipeCard from 'components/recipes/recipe-card.react';
import IngredientsEditor from 'components/recipes/ingredients/ingredients-editor.react';

import CheckboxInput from 'components/common/checkbox-input.react';

import ApiWrapper from 'util/api-wrapper';
import LocalStorageUtil from 'util/local-storage-util';

import _isEmpty from 'lodash/isEmpty';
import _isEqual from 'lodash/isEqual';
import _clone from 'lodash/clone';

import { tr } from 'util/translation-util';

import 'sass/recipes/import-recipe-form.scss';

class ImportRecipeForm extends React.Component {
  constructor(props) {
    super(props);

    const savedState = LocalStorageUtil.getFieldForComponent('importRecipe', 'parsedState');
    console.log('preloading from:', savedState);

    const defaultState = {
      recipe: null,
      text: {
        ingredients: null,
        directions: null,
        name: null,
        source: null
      },

      errors: {},
      warnings: {},
      showIngredientHelp: true,
      showPreview: false,
      ingredientsMultisection: false,
      directionsMultisection: false,

      structuredIngredientsEditor: false,
      structuredDirectionsEditor: false
    };

    if (_isEmpty(savedState)) {
      this.state = defaultState
    } else {
      this.state = Object.assign(defaultState, savedState);
    }
  }

  componentDidMount() {
    $('.ui.checkbox').checkbox();
  }

  componentDidUpdate(prevProps, prevState) {
    //console.log(prevState, this.state);
    if (!_isEqual(this.state.recipe, prevState.recipe)) {
      this.validate();
    }
  }

  hideIngredientHelp = () => {
    this.setState({
      showIngredientHelp: false
    })
  };

  toggleStructuredIngredients = () => {
    //console.log('toggle');
    this.setState({
      structuredIngredientsEditor: !this.state.structuredIngredientsEditor
    });
  };

  toggleStructuredDirections = () => {
    //console.log('toggle');
    this.setState({
      structuredDirectionsEditor: !this.state.structuredDirectionsEditor
    });
  };

  toggleIngredientsMultisection = () => {
    //console.log('toggle');
    this.setState({
      ingredientsMultisection: !this.state.ingredientsMultisection
    });
  };

  toggleDirectionsMultisection = () => {
    this.setState({
      directionsMultisection: !this.state.directionsMultisection
    });
  };

  parse = () => {
    const stateSnapshot = this.state;
    // save in case parsing fails
    LocalStorageUtil.saveFieldForComponent('importRecipe', 'parsedState', stateSnapshot);

    const directions = RecipeParser.parseDirections(this.state.text.directions, this.state.directionsMultisection);
    const ingredients = RecipeParser.parseIngredients(this.state.text.ingredients, this.state.ingredientsMultisection);

    const recipe = {
      name: this.state.text.name,
      category: this.state.text.category,

      video: this.state.text.video,
      image: this.state.text.image,

      directions,
      ingredients
    };

    try {
      const servings = parseInt(this.state.text.servings);
      recipe.servings = servings;
    } catch (e) {
      console.error(e);
    }

    console.log('prased recipe:', recipe);

    stateSnapshot.recipe = recipe;
    stateSnapshot.showPreview = true;

    // save again with updated recipe
    LocalStorageUtil.saveFieldForComponent('importRecipe', 'parsedState', stateSnapshot);

    this.setState({ recipe, showPreview: true });
  };

  onTextChange = (field) => {
    return (ev) => {
      const val = ev.target.value;
      const text = this.state.text;
      text[field] = val;
      this.setState({ text, errors: {} });
    }
  };

  submitRecipe = () => {
    const errors = this.validate();
    console.log(errors);
    if (_isEmpty(errors)) {
        ApiWrapper.uploadRecipe(this.state.recipe)
        .done(() => {
          console.log('woot');
          // transition to that recipes full-view page?
          // editor page?
        })
        .fail(() => { console.error('oh no') });
    }
  };

  validate = () => {
    console.log('validating:', this.state.recipe);
    const errors = {};
    const warnings = {};
    if (_isEmpty(this.state.text.name)) {
      errors.name = 'Name is required.';
    }
    if (_isEmpty(this.state.recipe)) {
      // hasn't pressed 'parse' yet;
      errors.recipe = 'Recipe has not been parsed.';
      this.setState({ errors });
      return errors;
    }
    if (_isEmpty(this.state.recipe.directions)) {
      errors.directions = 'Directions are required.';
    }
    if (_isEmpty(this.state.recipe.ingredients)) {
      errors.ingredients = 'Ingredients are required.';
    }

    if (!this.state.recipe.servings) {
      warnings.servings = 'Servings recommended.'
    }

    console.log('validation result:', errors, warnings);
    this.setState({ errors, warnings });
  };

  fieldClassName = (field, prefix='') => {
    return `${prefix} field ${this.state.errors[field] ? 'error' : ''}`.trim();
  };

  recipeFieldTextArea = (field, rows=3, size='') => {
    return (
      <div className={ this.fieldClassName(field, size) }>
        <label>{ tr(`recipes.fields.${field}`) }</label>
        <textarea rows={rows}
              value={this.state.text[field] || ''}
              onChange={this.onTextChange(field)}/>
        { this.state.errors[field] && <p className="error-text">{ this.state.errors[field] }</p> }
        { this.state.warnings[field] && <p className="warning-text">{ this.state.warnings[field] }</p> }
      </div>
    );
  }

  updateRecipe = (field) => {
    return (value) => {
      const recipe = _clone(this.state.recipe);
      recipe[field] = _clone(value);
      this.setState({ recipe });
    }
  };

  render() {
    //console.log(this.state, this.state.recipe.ingredients[0].items.length);
    console.log('import recipe form render:', this.state.recipe);
    let preview;

    if (this.state.showPreview) {
      if (!_isEmpty(this.state.errors)) {
        preview = (<div>
          { this.state.errors }
        </div>);
      } else if (!_isEmpty(this.state.recipe)) {
        preview = (
          <div className="recipe-preview">
            <div className="ui right-aligned basic segment"
                 style={{ padding: 0, textAlign: 'right' }}>
                 <button onClick={this.submitRecipe}
                         className="ui fluid green icon button">
                     { tr('nav.actions.okay', null, true) }
                     <i className="ui check icon"/>
                 </button>
           </div>
           <RecipeCard recipe={this.state.recipe}
                       showImage={false}
                       enableCollapse={false}
                       showActions={false}/>
         </div>
       );
      }
    }

    let ingredientsEditor;
    if (this.state.structuredIngredientsEditor) {
      ingredientsEditor = (
        <div className={ this.fieldClassName('ingredients') }>
          <label>{ tr('recipes.fields.ingredients') }</label>
          <IngredientsEditor ingredients={this.state.recipe.ingredients}
                             updateIngredients={this.updateRecipe('ingredients')}/>
        </div>
      );
    } else {
      ingredientsEditor = (
        <div className={ this.fieldClassName('ingredients') }>
          <label>{ tr('recipes.fields.ingredients') }</label>
          <textarea rows={10}
                    onChange={this.onTextChange('ingredients')}
                    value={this.state.text.ingredients || ''}/>
          { this.state.errors.ingredients && <p className="error-text">{ this.state.errors.ingredients }</p> }
        </div>
      );
    }

    const form = (
      <form className="ui form">
        <div className="fields">
          { this.recipeFieldTextArea('name', 2, 'eight wide') }
          { this.recipeFieldTextArea('servings', 1, 'three wide') }
          { this.recipeFieldTextArea('category', 1, 'five wide') }
        </div>

        <div className="two fields">
          { this.recipeFieldTextArea('image') }
          { this.recipeFieldTextArea('video') }
        </div>

        { (this.state.showIngredientHelp && !this.state.structuredIngredientsEditor) && <div className="ui info message">
          <i className="close icon" onClick={this.hideIngredientHelp}/>
          <div className="header">
            { tr('recipes.text.parsing_rules.header', null, true) }
          </div>
          <ul className="list">
            <li>{ tr('recipes.text.parsing_rules.quantities', null, true) }</li>
            <li>{ tr('recipes.text.parsing_rules.modifiers', null, true) }</li>
          </ul>
        </div> }
        { ingredientsEditor }
        { !this.state.structuredIngredientsEditor && <div className="inline field">
          <button className="ui right floated mini basic button"
                  onClick={this.toggleStructuredIngredients}>Switch</button>
          <CheckboxInput toggle={this.toggleIngredientsMultisection}
                         checked={this.state.ingredientsMultisection}
                         label="Multisection"/>
        </div> }
        <div className={ this.fieldClassName('directions') }>
          <label>{ tr('recipes.fields.directions') }</label>
          <textarea rows={10}
                    onChange={this.onTextChange('directions')}
                    value={this.state.text.directions || ''}/>
          { this.state.errors.directions && <p className="error-text">{ this.state.errors.directions }</p> }
        </div>
        <div className="inline field">
        <button className="ui right floated mini button"
                onClick={this.toggleStructuredDirections}>Switch</button>
          <CheckboxInput toggle={this.toggleDirectionsMultisection}
                         checked={this.state.directionsMultisection}
                         label="Multisection"/>
        </div>

      </form>
    );

    const parseButton = <button type="button"
            className={`ui violet fluid icon button ${_isEmpty(this.state.errors) ? '' : 'disabled' } parse`}
            onClick={this.parse}><i className="ui random icon"/>{ tr('nav.actions.parse') }</button>;

    const content = this.state.showPreview ?
      <div className="ui two column grid">
        <div className="column">
          { parseButton }
          { form }
        </div>
        <div className="column">
          { preview }
        </div>
      </div> :
      <div>
        { parseButton }
        { form }
      </div>


    return (
      <div className="import-recipe">
        { content }
      </div>
    );
  }
}

export default ImportRecipeForm;
