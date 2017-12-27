import LocalStorageUtil from 'util/local-storage-util';

const items = LocalStorageUtil.getShoppingList();

// TODO: remove this guys
const ShoppingListState = {
  getItems() {
    return items;
  },

  addItem(item) {
    items.addItem(item);
  }
}

export default ShoppingListState;
