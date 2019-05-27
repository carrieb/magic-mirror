import React from 'react';

import { amountToText } from 'src/common/quantities';

import { withKitchen } from 'state/KitchenState';

import { tr } from 'util/translation-util';

import _find from 'lodash/find';

class Ingredient extends React.Component {
  render() {
    const item = this.props.item;
    const quantity = item.quantity || {};

    const amountText = amountToText(quantity.amount);
    const name = item.name || item.description;

    //console.log(quantity.amount, quantity.unit, item.description);

    // TODO: this is actually a freaking pain of a translation. re-do it.

    // FIX: this is the worst way to do this
    const registeredIngredient = _find(this.props.kitchen, (ingr) => {
      const ingrName = ingr.name || ingr.description;
      return ingrName.toLowerCase() === name.toLowerCase();
    });

    const nameString = registeredIngredient ? `<a href="/kitchen/${name}">${ name ? name.toLowerCase() : '????' }</a>` : name;

    let displayText;
    if (!quantity.unit) {
      displayText = tr('ingredients.no_unit_text', {
        name: nameString,
        quantity: `${amountText}`,
        modifier: item.modifier ? `${item.modifier}` : '',
        smart_count: quantity.amount
      }, true);
    } else {
      displayText = tr('ingredients.text', {
        name: nameString,
        quantity: `${amountText}${quantity.unit}`,
        modifier: item.modifier ? `${item.modifier}` : '',
        smart_count: quantity.amount
      }, true);
    }



    console.log(name, registeredIngredient);

    let meta;
    if (!registeredIngredient) {
      meta = <a className="ui basic orange circular label">?</a>;
    }

    return (
      <span>
        <span dangerouslySetInnerHTML={{ __html: displayText }}/>
        { meta }
      </span>
    );
  }
}

export default withKitchen(Ingredient);
