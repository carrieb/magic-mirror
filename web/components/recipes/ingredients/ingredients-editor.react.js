import React from 'react';
import PropTypes from 'prop-types';

import RepeatableComponent from 'components/common/repeatable-component.react';

import IngredientsInputs from 'components/recipes/ingredients/ingredients-inputs.react';

import { EMPTY_INGREDIENT } from 'state/RecipesState';

import 'sass/recipes/ingredients-editor.scss';

import _uniqueId from 'lodash/uniqueId';
import _cloneDeep from 'lodash/cloneDeep';

class Section extends React.Component {
  updateIngredient = (i, ingredient) => {
    const section = this.props.section;
    section.items[i] = ingredient;
    this.props.updateSection(section);
  }

  addIngedient = () => {
    const section = this.props.section;
    const ingredients = section.items || [];
    const ingredient = _cloneDeep(EMPTY_INGREDIENT);
    ingredient.id = _uniqueId();
    ingredients.push(ingredient);
    section.items = ingredients;
    this.props.updateSection(section);
  }

  deleteIngredient = (idx) => {
    const section = this.props.section;
    const ingredients = section.items;
    const filtered = ingredients.filter((ingredient, i) => i === idx);
    //console.log(steps, filtered, idx);
    section.items = filtered;
    this.props.updateSection(section);
  }

  updateName = (ev) => {
    const section = this.props.section;
    section.name = ev.target.value;
    this.props.updateSection(section);
  }

  render() {
    const section = this.props.section || {};
    const ingredients = section.items || [];
    const nameInput = <div className="field">
      <label>Section Name</label>
      <input type="text" value={section.name} onChange={ this.updateName }/>
    </div>;
    const repeated = <RepeatableComponent component={IngredientsInputs}
                                          values={ingredients}
                                          showRemoveSelf={ this.props.totalSections > 1 }
                                          onChange={ this.updateIngredient }
                                          onAdd={ this.addIngedient }
                                          onRemoveSelf={ this.props.deleteSection }
                                          onRemove={ this.deleteIngredient }
                                          removeSelfText="Remove Section">
                                          { this.props.totalSections > 1 && nameInput }
    </RepeatableComponent>
    return (
      <div className="ui vertical segment ingredients-section">
        { repeated }
      </div>
    );
  }
}

class IngredientsEditor extends React.Component {
  constructor(props) {
    super(props);

    this.updateSection = this.updateSection.bind(this);
    this.addSection = this.addSection.bind(this);
    this.deleteSection = this.deleteSection.bind(this);

    this.state = { collapsed: this.props.ingredients.length == 0 }
  }

  toggleCollapsed = () => {
    this.setState({ collapsed: !this.state.collapsed });
  };

  addSection = () => {
    const ingr = this.props.ingredients;
    ingr.push({ id: _uniqueId(), items: [] });
    this.props.updateIngredients(ingr);
  }

  deleteSection(i) {
    return () => {
      const ingredients = this.props.ingredients;
      const filtered = ingredients.filter((ingr, idx) => i !== idx);
      this.props.updateIngredients(filtered);
    }
  }

  updateSection(i) {
    return (section) => {
      const ingredients = this.props.ingredients;
      ingredients[i] = section;
      this.props.updateIngredients(ingredients);
    }
  }

  render() {
    const ingredients = this.props.ingredients || [];
    const moreThanOneSection = ingredients.length > 1;

    const sections = ingredients.map((section, idx) => {
      return <Section section={section}
                      totalSections={ingredients.length}
                      key={section.id}
                      updateSection={ this.updateSection(idx) }
                      deleteSection={ this.deleteSection(idx) }/>
    });

    let content = (
      <div>
        <div>{ sections }</div>
        <button type="button"
          className="ui olive mini fluid button add-ingredient-button"
          onClick={this.addSection}>
            ADD SECTION
        </button>
      </div>
    );

    const caret = this.state.collapsed ? 'edit' : 'check';
    const text = this.state.collapsed ? 'Edit' : 'Done';
    const icon = <span style={{ float: 'right', margin: '0' }} onClick={this.toggleCollapsed}>
      <i className={`${caret} icon`}/>
      { text }
    </span>
    return (
      <div className="ingredients-editor">
        <h4>{ icon }Ingredients</h4>
        { !this.state.collapsed && content }
      </div>
    );
  }
}

IngredientsEditor.propTypes = {
  ingredients: PropTypes.array.isRequired
}

IngredientsEditor.defaultProps = {
  ingredients: []
}


// TODO: make section common b/w directions & ingredients ?
export default IngredientsEditor;
