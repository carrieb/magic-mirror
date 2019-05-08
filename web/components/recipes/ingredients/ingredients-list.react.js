import React from 'react';
import PropTypes from 'prop-types';

import { amountToText } from 'src/common/quantities';

import { tr } from 'util/translation-util';

class Ingredient extends React.Component {
  render() {
    const item = this.props.item;
    const quantity = item.quantity || {};

    const amountText = amountToText(quantity.amount);
    const name = item.name || item.description;

    console.log(quantity.amount, quantity.unit, item.description);

    // TODO: this is actually a freaking pain of a translation. re-do it.

    let displayText;
    if (!quantity.unit) {
      displayText = tr('ingredients.no_unit_text', {
        name: `<a href="/kitchen/${name}">${ name ? name.toLowerCase() : '????' }</a>`,
        quantity: `${amountText}`,
        modifier: item.modifier ? `${item.modifier}` : '',
        smart_count: quantity.amount
      }, true);
    } else {
      displayText = tr('ingredients.text', {
        name: `<a href="/kitchen/${name}">${ name ? name.toLowerCase() : '????' }</a>`,
        quantity: `${amountText}${quantity.unit}`,
        modifier: item.modifier ? `${item.modifier}` : '',
        smart_count: quantity.amount
      }, true);
    }

    return (
      <span dangerouslySetInnerHTML={{ __html: displayText }}/>
    );
  }
}

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
