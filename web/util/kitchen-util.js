import React from 'react';

import { ALL_ZONES, ALL_CATEGORIES } from 'state/kitchen/kitchen-constants';

import _kebabCase from 'lodash/kebabCase';

function filterItems(items, {
    zones=ALL_ZONES,
    categories=ALL_CATEGORIES,
    includeOutOfStock=false
  } = {}) {
  return items.filter((item) => {
    let filtered = false;
    if (item.zone && zones.indexOf(item.zone) === -1) {
      filtered = true;
    }
    if (item.category && categories.indexOf(item.category) === -1) {
      filtered = true;
    }
    if (!includeOutOfStock && item.quantity && item.quantity.amount === 0) {
      filtered = true;
    }
    return !filtered;
  });
}

function CategoryImage({ category, size='mini'}) {
  return category
    ? <img className={`ui ${size} image category`}
           src={`/images/kitchen/${_kebabCase(category.toLowerCase())}.png`}
           style={{ marginRight: '.75rem' }}/>
    : null;
}

module.exports = { filterItems, CategoryImage };
