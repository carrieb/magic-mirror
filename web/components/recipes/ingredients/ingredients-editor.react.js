import React from 'react';
import PropTypes from 'prop-types';

import RepeatableComponent from 'components/common/repeatable-component.react';

import IngredientsInputs from 'components/recipes/ingredients/ingredients-inputs.react';

import SectionedEditor from 'components/recipes/section-editor.react';

import { EMPTY_INGREDIENT } from 'state/RecipesState';

import 'sass/recipes/ingredients-editor.scss';

import _uniqueId from 'lodash/uniqueId';
import _cloneDeep from 'lodash/cloneDeep';

class IngredientsEditor extends React.Component {
  render() {
    //console.log(this.props.ingredients);
    return (
      <div className="ingredients-editor">
        <SectionedEditor title="Ingredients"
                         valuesKey="items"
                         emptyText="No ingredients."
                         component={IngredientsInputs}
                         updateSections={this.props.updateIngredients}
                         sections={this.props.ingredients}/>
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
