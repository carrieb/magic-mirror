import LocalStorageUtil from 'util/local-storage-util';

const items = LocalStorageUtil.getShoppingList();

let shoppingList = null;

const ShoppingListState = {
  getItems() {
    console.log(items);
    return items;
  },

  addItem(item) {
    shoppingList.addItem(item);
  },

  setShoppingList(component) {
    shoppingList = component;
  }
}

export default ShoppingListState;
