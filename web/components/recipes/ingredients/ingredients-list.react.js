import React from 'react';
import PropTypes from 'prop-types';

class Ingredient extends React.Component {
  render() {
    const item = this.props.item;
    let q = item.quantity || {};
    const remainder = q.amount - Math.floor(q.amount);
    const whole = q.amount - remainder;
    let amt = whole === 0 ? '' : whole + ' ';
    if (remainder === .75) { amt += '3/4 '; }
    if (remainder === .33) { amt += '⅓ '; }
    if (remainder === .25) { amt += '¼ '; }
    if (remainder === .5) { amt += '½ '; }
    const quantity = <span>{amt}{q.unit}{(q.amount > 1 && q.unit)&& 's'}</span>;
    const name = item.name || item.description;
    return (
      <span>
        <b>{quantity}</b>{q.unit && ' of '}{item.modifier} <a href={`/kitchen/${name}`}>{ name ? name.toLowerCase() : '???' }</a>
      </span>
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
    return <div className="ui list">{ itemEls }</div>
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
