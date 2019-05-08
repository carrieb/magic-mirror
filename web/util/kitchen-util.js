import { ALL_ZONES, ALL_CATEGORIES } from 'state/kitchen/kitchen-constants';

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
    if (!includeOutOfStock && item.quantity.amount === 0) {
      filtered = true;
    }
    return !filtered;
  });
}

module.exports = { filterItems };
