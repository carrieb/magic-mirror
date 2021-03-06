const SHOPPING_LIST_KEY = 'shoppingList:';
const KITCHEN_TAGS_KEY = 'kitchenTags:';
const LAST_ZONE_KEY = 'zone:';
const LAST_CATEGORY_KEY = 'category:';
const NEW_RECIPE_BEING_EDITED = 'newRecipeBeingEdited:';

// inventory keys

const INVENTORY_FILTER_ZONES = 'inventoryFitlerZones:';
const INVENTORY_FILTER_CATEGORIES = 'inventoryFilterCategories:';

const keys = [
  SHOPPING_LIST_KEY, KITCHEN_TAGS_KEY,
  LAST_ZONE_KEY, LAST_CATEGORY_KEY,
  NEW_RECIPE_BEING_EDITED,
  INVENTORY_FILTER_ZONES, INVENTORY_FILTER_CATEGORIES
];

function _set(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function _get(key) {
  const val = localStorage.getItem(key);
  try {
    return JSON.parse(val);
  } catch (e) {
    console.error(val, e);
    return null;
  }
}

const LocalStorageUtil = {
  getShoppingList() {
    return _get(SHOPPING_LIST_KEY) || [];
  },

  saveShoppingList(list) {
    _set(SHOPPING_LIST_KEY, list);
  },

  saveKitchenTags(tags) {
    _set(KITCHEN_TAGS_KEY, tags);
  },

  getKitchenTags() {
    const res = _get(KITCHEN_TAGS_KEY);
    return res;
  },

  getLastZone() {
    return _get(LAST_ZONE_KEY);
  },

  getLastCategory() {
    return _get(LAST_CATEGORY_KEY);
  },

  getInventoryFilterZones() {
    return _get(INVENTORY_FILTER_ZONES);
  },

  getInventoryFilterCategories() {
    return _get(INVENTORY_FILTER_CATEGORIES);
  },

  getNewRecipeBeingEdited() {
    return _get(NEW_RECIPE_BEING_EDITED);
  },

  saveZone(zone) {
    _set(LAST_ZONE_KEY, zone);
  },

  saveCategory(category) {
    _set(LAST_CATEGORY_KEY, category);
  },

  saveInventoryFilterZones(zones) {
    _set(INVENTORY_FILTER_ZONES, zones);
  },

  saveInventoryFilterCategories(categories) {
    _set(INVENTORY_FILTER_CATEGORIES, categories);
  },

  saveNewRecipeBeingEdited(recipe) {
    _set(NEW_RECIPE_BEING_EDITED, recipe);
  },

  saveFieldForComponent(component, field, value) {
    _set(`${component}.${field}:`, value);
  },

  getFieldForComponent(component, field) {
    return _get(`${component}.${field}:`);
  },

  getLocale() {
    return _get('hl');
  },

  setLocale(hl) {
    console.log(hl);
    _set('hl', hl);
  }
};

export default LocalStorageUtil;
