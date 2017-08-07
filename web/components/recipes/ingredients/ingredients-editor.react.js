import React from 'react';
import PropTypes from 'prop-types';

import RepeatableComponent from 'components/common/repeatable-component.react';

import IngredientsInputs from 'components/recipes/ingredients/ingredients-inputs.react';

class IngredientsEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = { collapsed: true }
  }

  toggleCollapsed() {
    this.setState({ collapsed: !this.state.collapsed });
  }

  addIngedientsSection() {
    const ingr = this.props.ingredients;
    ingr.push({ items: [ {} ] });
    this.props.updateIngredients(ingr);
  }

  updateIngredientsSection(idx, field, value) {
    const ingr = this.props.ingredients;
    ingr[idx][field] = value;
    this.props.updateIngredients(ingr);
  }

  updateIngredients(idx, index, field, value) {
    const ingr = this.props.ingredients;
    ingr[idx].items[index][field] = value;
    this.props.updateIngredients(ingr);
  }

  addIngredient(idx) {
    const ingr = this.props.ingredients;
    ingr[idx].items.push({}); // TODO: default ingredient object
    this.props.updateIngredients(ingr);
  }

  deleteIngredient(idx, index) {
    const ingr = this.props.ingredients;
    ingr[idx].items.splice(index, 1);
    this.props.updateIngredients(ingr);
  }

  render() {
    const ingr = this.props.ingredients;
    const moreThanOneSection = ingr.length > 1;
    const ingredientsSections = ingr.map((ingObj, idx) => {
      const nameField = (
        <div className="ui field">
          <label>Ingredients Section Name</label>
          <input type="text" placeholder="default" onChange={(ev) => this.updateIngredientsSection(idx, 'name', ev.target.value)}/>
        </div>
      );

      return (
        <div className="ingredients-section" key={idx}>
          { moreThanOneSection && nameField }
          { moreThanOneSection && <div className="ui sub header">Ingredients</div>}
          <RepeatableComponent
            component={IngredientsInputs}
            onChange={(index, field, value) => this.updateIngredients(idx, index, field, value)}
            onAdd={() => this.addIngredient(idx)}
            onDelete={(index) => this.deleteIngredient(idx, index)}
          />
        </div>
      );
    });

    let content = (
      <div>
        { ingredientsSections }
        <button type="button"
          className="ui basic olive mini fluid button add-ingredient-button"
          onClick={() => this.addIngedientsSection()}>
            Add Ingredients Section
        </button>
      </div>
    );

    const caret = this.state.collapsed ? 'plus square outline' : 'minus square outline';
    const icon = <i className={`${caret} icon`}
      style={{ float: 'right', margin: '0' }}
      onClick={() => this.toggleCollapsed()}/>
    return (
      <div className="ingredients-editor">
        <h3 className="ui header">{ icon }Ingredients</h3>
        { !this.state.collapsed && content }
      </div>
    );
  }
}

IngredientsEditor.propTypes = {

}

export default IngredientsEditor;
