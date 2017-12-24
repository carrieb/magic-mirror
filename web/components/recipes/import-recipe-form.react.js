import React from 'react';
import PropTypes from 'prop-types';

// TODO: move this to api call
import RecipeParser from 'src/recipe-parser';

import RecipeCard from 'components/recipes/recipe-card.react';

import ApiWrapper from 'util/api-wrapper';
import LocalStorageUtil from 'util/local-storage-util';
import _isEmpty from 'lodash/isEmpty';

import 'sass/recipes/import-recipe-form.scss';

class ImportRecipeForm extends React.Component {
  constructor(props) {
    super(props);

    this.parse = this.parse.bind(this);
    this.onTextChange = this.onTextChange.bind(this);
    this.submitRecipe = this.submitRecipe.bind(this);
    this.fieldClassName = this.fieldClassName.bind(this);
    this.validate = this.validate.bind(this);
    this.hideIngredientHelp = this.hideIngredientHelp.bind(this);

    let text = LocalStorageUtil.getLastImportText();
    console.log(text);
    if (_isEmpty(text)) {
      text = { ingredients: null, directions: null, name: null, source: null };
    }
    this.state = { recipe: null, text, errors: {}, showIngredientHelp: true };
  }

  hideIngredientHelp() {
    this.setState({ showIngredientHelp: false })
  }

  parse() {
    const valid = this.validate();
    console.log('parse', valid);
    if (valid) { LocalStorageUtil.saveLastImportText(this.state.text); }
    const directions = RecipeParser.parseDirections(this.state.text.directions);
    const ingredients = RecipeParser.parseIngredients(this.state.text.ingredients);
    const recipe = {
      name: this.state.text.name,
      source: this.state.text.source,
      directions,
      ingredients
    };
    this.setState({ recipe });
  }

  onTextChange(field) {
    return (ev) => {
      const val = ev.target.value;
      const text = this.state.text;
      text[field] = val;
      this.setState({ text, errors: {} });
    }
  }

  submitRecipe() {
    const valid = this.validate();
    console.log(valid);
    if (valid) {
        ApiWrapper.uploadRecipe(this.state.recipe)
        .done(() => {
          console.log('woot');
          // transition to that recipes full-view page?
          // editor page?
        })
        .fail(() => { console.error('oh no') });
    }
  }

  validate() {
    const errors = this.state.errors;
    if (_isEmpty(this.state.text.name)) {
      errors.name = 'Name is required.';
    }
    if (_isEmpty(this.state.recipe)) {
      // hasn't pressed 'parse' yet;
      return false;
    }
    if (_isEmpty(this.state.recipe.directions)) {
      errors.directions = 'Directions are required.';
    }
    if (_isEmpty(this.state.recipe.ingredients)) {
      errors.ingredients = 'Ingredients are required.';
    }
    this.setState({ errors });
    return _isEmpty(errors);
  }

  fieldClassName(field) {
    return `field ${this.state.errors[field] ? 'error' : ''}`;
  }

  render() {
    return (
      <div className="import-recipe">
        <div className="ui two column grid">
            <div className="column">
              <form className="ui form">
                <div className="two fields">
                  <div className={ this.fieldClassName('name') }>
                    <label>Name</label>
                    <textarea rows={3}
                           value={this.state.text.name || ''}
                           onChange={this.onTextChange('name')}/>
                    { this.state.errors.name && <p className="error-text">{ this.state.errors.name }</p> }
                  </div>
                  <div className="field">
                    <label>Source</label>
                    <textarea rows={3}
                           value={this.state.text.source || ''}
                           onChange={this.onTextChange('source')}/>
                  </div>
                </div>
                { this.state.showIngredientHelp && <div className="ui info message">
                  <i className="close icon" onClick={this.hideIngredientHelp}/>
                  <div className="header">
                    Ingredient Parsing Rules
                  </div>
                  <ul className="list">
                    <li>Quantities must be listed <b>first</b>.</li>
                    <li>Modifiers should go in <b>parens</b>.</li>
                  </ul>
                </div> }
                <div className={ this.fieldClassName('ingredients') }>
                  <label>Ingredients</label>
                  <textarea rows={10}
                            onChange={this.onTextChange('ingredients')}
                            value={this.state.text.ingredients || ''}/>
                  { this.state.errors.ingredients && <p className="error-text">{ this.state.errors.ingredients }</p> }
                </div>
                <div className={ this.fieldClassName('directions') }>
                  <label>Directions</label>
                  <textarea rows={10}
                            onChange={this.onTextChange('directions')}
                            value={this.state.text.directions || ''}/>
                  { this.state.errors.directions && <p className="error-text">{ this.state.errors.directions }</p> }
                </div>
                <button type="button"
                        className={`ui violet fluid icon button ${_isEmpty(this.state.errors) ? '' : 'disabled' }`}
                        onClick={this.parse}><i className="ui random icon"/>Parse</button>
              </form>
            </div>
            <div className="column">
              { this.state.recipe &&
               <div className="ui right-aligned basic segment" style={{ padding: 0, textAlign: 'right' }}>
                <button onClick={this.submitRecipe} className={`ui green icon button ${_isEmpty(this.state.errors) ? '' : 'disabled' }`}>
                Looks Good! <i className="ui check icon"/>
               </button></div>}
              { this.state.recipe &&
                <RecipeCard recipe={this.state.recipe}
                            showImage={false}
                            enableCollapse={false}
                            showActions={false}/> }
            </div>
        </div>
      </div>
    );
  }
}

export default ImportRecipeForm;
