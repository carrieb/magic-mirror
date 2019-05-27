import React from 'react';
import PropTypes from 'prop-types';

import Ingredient from 'components/recipes/ingredients/ingredient.react';

class IngredientsList extends React.Component {
  render() {
    if (this.props.maxItems === 0) return null;
    let itemEls = this.props.items.map((item, idx) => {
      if (idx >= this.props.maxItems) return null;
      return <div className="item" key={idx}>
        <Ingredient item={item}/>
      </div>;
    });
    return <div className="ui bulleted list">{ itemEls }</div>
  }
}

IngredientsList.propTypes = {
  items: PropTypes.array,
  maxItems: PropTypes.number
}

IngredientsList.defaultProps = {
  items: [],
  maxItems: 100
}

export default IngredientsList;
