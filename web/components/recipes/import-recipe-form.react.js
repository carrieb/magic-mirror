import React from 'react';
import PropTypes from 'prop-types';

// TODO: move this to api call
import RecipeParser from 'src/recipe-parser';

import RecipeCard from 'components/recipes/recipe-card.react';

import ApiWrapper from 'util/api-wrapper';
import LocalStorageUtil from 'util/local-storage-util';
import _isEmpty from 'lodash/isEmpty';
import _isEqual from 'lodash/isEqual';

import { tr } from 'util/translation-util';

import 'sass/recipes/import-recipe-form.scss';

class ImportRecipeForm extends React.Component {
  constructor(props) {
    super(props);

    const savedState = LocalStorageUtil.getFieldForComponent('importRecipe', 'parsedState');
    console.log('preloading from:', savedState);

    if (_isEmpty(savedState)) {
      this.state = {
        recipe: null,
        text: {
          ingredients: null,
          directions: null,
          name: null,
          source: null
        },
        errors: {},
        showIngredientHelp: true,
        showPreview: false,
        ingredientsMultisection: false,
        directionsMultisection: false
      };
    } else {
      this.state = savedState;
    }
  }

  componentDidMount() {
    $('.ui.checkbox').checkbox();
  }

  componentDidUpdate(prevProps, prevState) {
    console.log(prevState, this.state);
    if (!_isEqual(this.state.recipe, prevState.recipe)) {
      this.validate();
    }
  }

  hideIngredientHelp = () => {
    this.setState({
      showIngredientHelp: false
    })
  };

  toggleIngredientsMultisection = () => {
    console.log('toggle');
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
      source: this.state.text.source,
      directions,
      ingredients
    };

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
    const errors = this.state.errors;
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
    console.log('validating:', errors);
    this.setState({ errors });
  };

  fieldClassName = (field) => {
    return `field ${this.state.errors[field] ? 'error' : ''}`;
  };

  render() {
    console.log(this.state, this.state.recipe.ingredients[0].items.length);
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

    const form = (
      <form className="ui form">
        <div className="two fields">
          <div className={ this.fieldClassName('name') }>
            <label>{ tr('recipes.fields.name') }</label>
            <textarea rows={3}
                   value={this.state.text.name || ''}
                   onChange={this.onTextChange('name')}/>
            { this.state.errors.name && <p className="error-text">{ this.state.errors.name }</p> }
          </div>
          <div className="field">
            <label>{ tr('recipes.fields.source') }</label>
            <textarea rows={3}
                   value={this.state.text.source || ''}
                   onChange={this.onTextChange('source')}/>
          </div>
        </div>

        { this.state.showIngredientHelp && <div className="ui info message">
          <i className="close icon" onClick={this.hideIngredientHelp}/>
          <div className="header">
            { tr('recipes.text.parsing_rules.header', null, true) }
          </div>
          <ul className="list">
            <li>{ tr('recipes.text.parsing_rules.quantities', null, true) }</li>
            <li>{ tr('recipes.text.parsing_rules.modifiers', null, true) }</li>
          </ul>
        </div> }
        <div className={ this.fieldClassName('ingredients') }>
          <label>{ tr('recipes.fields.ingredients') }</label>
          <textarea rows={10}
                    onChange={this.onTextChange('ingredients')}
                    value={this.state.text.ingredients || ''}/>
          { this.state.errors.ingredients && <p className="error-text">{ this.state.errors.ingredients }</p> }

        </div>
        <div className="inline field">
          <div className="ui checkbox"
               onClick={this.toggleIngredientsMultisection}>
            <input type="checkbox"
                  tabIndex="0"
                  className="hidden"
                  defaultChecked={this.state.ingredientsMultisection}/>
            <label>Multisection</label>
          </div>
        </div>
        <div className={ this.fieldClassName('directions') }>
          <label>{ tr('recipes.fields.directions') }</label>
          <textarea rows={10}
                    onChange={this.onTextChange('directions')}
                    value={this.state.text.directions || ''}/>
          { this.state.errors.directions && <p className="error-text">{ this.state.errors.directions }</p> }
        </div>
        <div className="inline field">
          <div className="ui checkbox"
               onClick={this.toggleDirectionsMultisection}>
            <input type="checkbox"
                  tabIndex="0"
                  className="hidden"
                  defaultChecked={this.state.directionsMultisection}/>
            <label>Multisection</label>
          </div>
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
