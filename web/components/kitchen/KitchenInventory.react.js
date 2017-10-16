import React from 'react';

import { Link } from 'react-router-dom';

import KitchenState from 'state/KitchenState';
import MessagingUtil from 'util/messaging-util';

import KitchenItemCard from 'components/kitchen/KitchenItemCard';

class KitchenInventory extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      kitchen: [],
      selectedItem: null,
      layout: 'block'
    }
  }

  componentWillMount() {
    MessagingUtil.subscribeDevice();
    KitchenState.getKitchen((kitchen) => {
      console.log(kitchen);
      this.setState({ kitchen });
    });
  }

  showModal(idx) {
    return () => {
      console.log(this.state.kitchen);
      const selectedItem = this.state.kitchen[idx];
      this.setState({ selectedItem });
      //$('.ui.modal').modal('show');
    };
  }

  showAddModal() {
    let kitchen = this.state.kitchen;
    kitchen.push({ description: 'new' });
    const selectedItem = kitchen[kitchen.length -1]
    this.setState({ selectedItem, kitchen });
  }

  delete(id) {
    KitchenState.trashFood(id, (kitchen) => {
      console.log(kitchen);
      this.setState({ kitchen, selectedItem: null });
    });
  }

  componentDidUpdate() {
    if (this.state.layout === 'table') {
      $('table').tablesort();
    }
  }

  render() {
    let inventory = null;
    let layoutOptions = [
      <a className={`item icon-only ${this.state.layout === 'block' ? 'active': ''}`}
         key="block-layout" onClick={() => this.setState({ layout: 'block' }) }>
        <i className="block layout icon"></i>
      </a>,
      <a className={`item icon-only ${this.state.layout === 'table' ? 'active': ''}`}
         key="list-layout" onClick={() => this.setState({ layout: 'table' }) }>
        <i className="list layout icon"></i>
      </a>
    ];

    if (this.state.layout === 'block') {
      let itemCards = this.state.kitchen.map((foodItem, idx) => {
        return (
          <KitchenItemCard foodItem={foodItem}
                           delete={(id) => this.delete(id)}
                           key={idx}
                           onSettingsClick={this.showModal(idx)}/>
        );
      });

      inventory = (
        <div className="kitchen-inventory">
          <div className="ui six doubling cards">
            { itemCards.length > 0 ? itemCards : <div className="ui card"><div className="content">Nothing in inventory.</div></div> }
          </div>
        </div>
      );
    }

    if (this.state.layout === 'table') {
      const itemRows = this.state.kitchen.map((foodItem, idx) => {
        let imageUrl = foodItem.img ? `/food-images/${foodItem.img}` : '/food-images/no-image.png';
        return (
          <tr key={idx} className="food-item-row">
            <td><img src={imageUrl}/></td>
            <td>{foodItem.description}</td>
            <td>...</td>
          </tr>
        )
      });
      inventory = (
        <table className="ui sortable unstackable table">
          <thead>
            <tr>
              <th></th>
              <th>Name </th>
              <th></th>
            </tr>
          </thead>
            <tbody>
            { itemRows }
            </tbody>
          <tfoot>
            <tr>
              <th>{this.state.kitchen.length} Items</th>
            </tr>
          </tfoot>
        </table>
      );
    }

    // TODO: add ability to add any item custom
    return (
      <div className="kitchen-inventory">
        { inventory }
        <div>
          <Link to="/kitchen/new">
            <button className="ui fluid huge button">Add Item</button>
          </Link>
        </div>
      </div>
    );
  }
}

export default KitchenInventory;