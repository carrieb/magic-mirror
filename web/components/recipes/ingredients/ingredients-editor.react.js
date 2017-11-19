import React from 'react';
import PropTypes from 'prop-types';

import RepeatableComponent from 'components/common/repeatable-component.react';

import IngredientsInputs from 'components/recipes/ingredients/ingredients-inputs.react';

import 'sass/recipes/ingredients-editor.scss';

class IngredientsEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = { collapsed: this.props.ingredients.length == 0 }
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
        <div className="ui inline field">
          <label>SECTION TITLE</label>
          <input type="text"
            placeholder="default"
            onChange={(ev) => this.updateIngredientsSection(idx, 'name', ev.target.value)}/>
        </div>
      );

      // <RepeatableComponent
      //   values={ingObj.items}
      //   component={IngredientsInputs}
      //   onChange={(index, field, value) => this.updateIngredients(idx, index, field, value)}
      //   onAdd={() => this.addIngredient(idx)}
      //   onDelete={(index) => this.deleteIngredient(idx, index)}

      return (
        <div className={`${moreThanOneSection && 'ui vertical segment'} ingredients-section`} key={idx}>
          { moreThanOneSection && nameField }
          { moreThanOneSection && <div className="ui sub header">Ingredients</div>}

          />
        </div>
      );
    });

    let content = (
      <div>
        { ingredientsSections }
        <button type="button"
          className="ui olive mini fluid button add-ingredient-button"
          onClick={() => this.addIngedientsSection()}>
            ADD SECTION
        </button>
      </div>
    );

    const caret = this.state.collapsed ? 'edit' : 'check';
    const icon = <i className={`${caret} icon`}
      style={{ float: 'right', margin: '0' }}
      onClick={() => this.toggleCollapsed()}/>
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

export default IngredientsEditor;
