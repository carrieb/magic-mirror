const LAST_IMPORT_TEXT_KEY = 'lastImportText:';

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
  }
};

export default LocalStorageUtil;
