import React from 'react';
import PropTypes from 'prop-types';

import RecipeParser from 'src/recipe-parser';

import RepeatableComponent from 'components/common/repeatable-component.react';

import IngredientsInputs from 'components/recipes/ingredients/ingredients-inputs.react';

import SectionedEditor from 'components/recipes/section-editor.react';

import { EMPTY_INGREDIENT } from 'state/RecipesState';

import { tr } from 'util/translation-util';

import 'sass/recipes/ingredients-editor.scss';

import _uniqueId from 'lodash/uniqueId';
import _cloneDeep from 'lodash/cloneDeep';
import _throttle from 'lodash/throttle';

class IngredientsEditor extends React.Component {
  state = {
    showTextEditor: false,
    text: RecipeParser.ingredientsToText(this.props.ingredients)
  }

  toggleShowTextEditor = () => {
    this.setState({ showTextEditor: !this.state.showTextEditor });
  }

  updateIngredientsForText = () => {
    const parsed = RecipeParser.parseIngredients(this.state.text);
    this.props.updateIngredients(parsed);
  };

  throttledUpdateIngredients = _throttle(this.updateIngredientsForText, 2000, { trailing: true });

  handleTextChange = (ev) => {
    const text = ev.target.value;
    this.setState({ text });
    this.throttledUpdateIngredients();
  };

  render() {
    // console.log(this.state.text);
    const toggleButton = (
      <button className="ui fluid basic button toggle-format"
              onClick={this.toggleShowTextEditor}>
              { this.state.showTextEditor ? 'Switch to Inputs' : 'Switch to Text' }
      </button>
    );

    let content;
    if (this.state.showTextEditor) {
      content = (
        <div>
          <h4 className="ui header">{ tr('recipes.fields.ingredients') }</h4>
          { false && toggleButton }
          <textarea value={this.state.text}
                    onChange={this.handleTextChange}/>
        </div>
      );
    } else {
      content = <SectionedEditor title="Ingredients" showTitle={false}
                       valuesKey="items"
                       emptyText="No ingredients."
                       component={IngredientsInputs}
                       updateSections={this.props.updateIngredients}
                       sections={this.props.ingredients}>
         { toggleButton }
      </SectionedEditor>;
    }
    return (
      <div className="ingredients-editor">
        { content }
      </div>
    );
  }
}

IngredientsEditor.propTypes = {
  ingredients: PropTypes.array.isRequired,
  enableCollapse: PropTypes.bool
}

IngredientsEditor.defaultProps = {
  ingredients: [],
  enableCollapse: false
}

export default IngredientsEditor;
