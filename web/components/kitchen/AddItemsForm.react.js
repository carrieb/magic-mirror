import React from 'react';
import PropTypes from 'prop-types';

import ItemInputs from '../receipts/item-inputs';

import ControlledItemEditor from 'components/kitchen/controlled-item-editor.react';

import KitchenState from 'state/KitchenState';

import _clone from 'lodash/clone';

class AddItemsForm extends React.Component {
  constructor(props) {
    super(props)

    this.addItem = this.addItem.bind(this);
  }

  updateItemFieldAtIndex(index, field, value) {
    const items = this.props.items;
    items[index][field] = value;
    this.props.update(items);
  }

  addItem(ev) {
    const items = this.props.items;
    items.push(_clone(KitchenState.DEFAULT_ITEM));
    this.props.update(items);
    ev.preventDefault();
  }

  removeItem(ev, idx) {
    const items = this.props.items;
    items.splice(idx, 1);
    this.props.update(items);
    ev.preventDefault();
  }

  render() {
    const items = this.props.items.map((item, idx) =>
      <ItemInputs key={idx}
                  item={item}
                  onDelete={(ev) => this.removeItem(ev, idx)}
                  onChange={(field, value) => this.updateItemFieldAtIndex(idx, field, value)}/>
    );

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
}

AddItemsForm.propTypes = {
  items: PropTypes.array,
  update: PropTypes.func
}

export default AddItemsForm;
