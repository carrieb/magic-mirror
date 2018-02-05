const LAST_IMPORT_TEXT_KEY = 'lastImportText:';
const SHOPPING_LIST_KEY = 'shoppingList:';
const KITCHEN_TAGS_KEY = 'kitchenTags:';
const LAST_ZONE_KEY = 'zone:';
const LAST_CATEGORY_KEY = 'category:';

function _set(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function _get(key) {
  const val = localStorage.getItem(key);
  return JSON.parse(val);
}

const LocalStorageUtil = {
  saveLastImportText(text) {
    _set(LAST_IMPORT_TEXT_KEY, text);
  },

  getLastImportText() {
    return _get(LAST_IMPORT_TEXT_KEY);
  },

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

  saveZone(zone) {
    _set(LAST_ZONE_KEY, zone);
  },

  saveCategory(category) {
    _set(LAST_CATEGORY_KEY, category);
  }
};

export default LocalStorageUtil;
