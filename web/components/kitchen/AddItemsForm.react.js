import React from 'react';

import ItemInputs from '../receipts/item-inputs';

const AddItemsForm = React.createClass({
  getInitialState() {
    return {
      items: []
    }
  },

  updateItemFieldAtIndex(index) {
    return (field) => {
      return (ev) => {
        console.log(ev.target.value);
        this.state.items[index][field] = ev.target.value;
        //console.log(this.state.items);
        this.setState({ items: this.state.items });
      };
    };
  },

  addItem(ev) {
    const items = this.state.items;
    items.push({ description: 'new item', price: 1.11 });
    this.setState({ items });
    ev.preventDefault();
  },

  render() {
    const items = this.state.items.map((item, idx) => {
      return <ItemInputs key={idx} item={item} onChange={this.updateItemFieldAtIndex(idx)}/>
    });
    return (
      <div className="add-kitchen-items-form">
        <form className="ui form">
        { items }
        <button className="ui fluid icon add-item button" onClick={this.addItem}>
          <i className="plus icon"></i>
          Add Item
        </button>
        </form>
      </div>
    );
  }
});

export default AddItemsForm;
