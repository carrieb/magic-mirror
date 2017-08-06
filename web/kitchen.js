import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory, Link } from 'react-router';

import KitchenState from 'state/KitchenState';
import MessagingUtil from 'util/messaging-util';

import KitchenItemCard from 'components/kitchen/KitchenItemCard';
import FoodEditorHandler from 'components/kitchen/FoodEditorHandler';
import AddItemsForm from 'components/kitchen/AddItemsForm.react';

class Kitchen extends React.Component {
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
    KitchenState.getKitchen((kitchen) => this.setState({ kitchen }));
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
    const lastRoute = this.props.routes[this.props.routes.length-1];
    let inventory = null;
    let layoutOptions = null;
    let addButton = null;
    if (lastRoute.path === '/kitchen') {
      addButton = <button className="ui fluid huge purple button"
        onClick={() => this.showAddModal()}>
          Add Item
      </button>;
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
              { itemCards }
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
                <th>Name</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              { itemRows }
            </tbody>
            <tfoot>
              <tr><th>{this.state.kitchen.length} Items</th>
              <th>2 Approved</th>
              <th></th>
            </tr></tfoot>
          </table>
        );
      }

      layoutOptions = [
        <a className={`item icon-only ${this.state.layout === 'block' ? 'active': ''}`}
          key="block-layout" onClick={() => this.setState({ layout: 'block' }) }>
          <i className="block layout icon"></i>
        </a>,
        <a className={`item icon-only ${this.state.layout === 'table' ? 'active': ''}`}
          key="list-layout" onClick={() => this.setState({ layout: 'table' }) }>
          <i className="list layout icon"></i>
        </a>
      ];
    }

    // TODO: add ability to add any item custom
    return (
      <div className="ui container kitchen-container">
        <div className="ui secondary menu">
          <div className="header active item">
            <Link to="/kitchen">Kitchen</Link>
          </div>
          { layoutOptions }
          <div className="right menu">
            <a className="item" href="/process-receipt">
              <i className="icons icon">
                <i className="shopping basket icon"></i>
                <i className="inverted corner upload icon"></i>
              </i>
              Upload Receipt
            </a>
          </div>
        </div>
        { this.props.children }
        { inventory }
        { addButton }
      </div>
    );
  }
}


window.onload = function() {
  ReactDOM.render(
    <Router history={browserHistory}>
      <Route path="/kitchen" component={Kitchen}>
        <Route path="/kitchen/unpack" component={AddItemsForm}/>
        <Route path="/kitchen/:foodName" component={FoodEditorHandler}/>
      </Route>
    </Router>,
    document.getElementById("render-wrapper")
  );
}
