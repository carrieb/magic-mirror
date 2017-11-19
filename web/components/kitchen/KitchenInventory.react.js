import React from 'react';

import { Link } from 'react-router-dom';

import KitchenState from 'state/KitchenState';
import KitchenConstants from 'state/kitchen/kitchen-constants';

import KitchenItemCard from 'components/kitchen/KitchenItemCard';

import 'sass/kitchen/inventory.scss';

const ALL_CATEGORIES = KitchenConstants.ALL_CATEGORIES;
const ALL_ZONES = KitchenConstants.ALL_ZONES;

class KitchenInventory extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      kitchen: [],
      selectedItem: null,
      layout: 'Cards',
      categories: new Set(['Dairy', 'Produce', 'Meat', 'Leftovers', 'Dry Goods']),
      zones: new Set(ALL_ZONES)
    }
  }

  componentWillMount() {
    KitchenState.getKitchen((kitchen) => {
      console.log(kitchen);
      this.setState({ kitchen });
    });
  }

  delete(id) {
    KitchenState.trashFood(id, (kitchen) => {
      console.log(kitchen);
      this.setState({ kitchen, selectedItem: null });
    });
  }

  star(id) {
    // TODO: ..
  }

  toggleLayout() {
    this.setState({
      layout: this.state.layout === 'Cards' ? 'List' : 'Cards'
    });
  }

  toggleCategory(ev, category) {
    const categories = this.state.categories;
    if (categories.has(category)) {
      categories.delete(category);
    } else {
      categories.add(category);
    }
    this.setState({ categories });
    document.activeElement.blur();
  }

  toggleZone(ev, zone) {
    const zones = this.state.zones;
    if (zones.has(zone)) {
      zones.delete(zone);
    } else {
      zones.add(zone);
    }
    this.setState({ zones });
    document.activeElement.blur();
  }

  componentDidUpdate() {
    if (this.state.layout === 'table') {
      $('table').tablesort();
    }
  }

  render() {
    let inventory = null;

    if (this.state.layout === 'Cards') {
      let itemCards = this.state.kitchen
      .filter((item) => {
        let filtered = false;
        if (item.zone && !this.state.zones.has(item.zone)) {
          filtered = true;
        }
        if (item.category && !this.state.categories.has(item.category)) {
          filtered = true;
        }
        return !filtered;
      })
      .map((foodItem, idx) => {
        return (
          <KitchenItemCard foodItem={foodItem}
                           delete={(id) => this.delete(id)}
                           key={idx}/>
        );
      });

      inventory = (
        <div className="kitchen-inventory">
          { itemCards.length > 0 ?
            <div className="ui six doubling cards">{ itemCards }</div> :
            <div className="ui fluid card"><div className="content">Nothing in inventory.</div></div> }
        </div>
      );
    }

    if (this.state.layout === 'List') {
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
    const animatedButtonClass = (isActive) => `ui ${isActive ? 'active ' : ''} vertical animated icon button`;
    const animatedButton = (name, isActive, onClick, imgSrc) => {
      return (
        <div className={ animatedButtonClass(isActive(name)) }
          key={name}
          tabIndex="0"
          onClick={onClick}>
          <div className="hidden content"><img src={imgSrc}/></div>
          <div className="visible content">{name}</div>
        </div>
      );
    }

    const zoneButtons = ALL_ZONES.map((zone) => animatedButton(zone, (z) => this.state.zones.has(z), (ev) => this.toggleZone(ev, zone), `/images/kitchen/${zone.toLowerCase()}.png`));
    const categoryButtons = ALL_CATEGORIES.map((cat) => animatedButton(cat, (c) => this.state.categories.has(c), (ev) => this.toggleCategory(ev, cat), `/images/kitchen/${cat.toLowerCase()}.png`));

    const layoutClassName = (layout) => `ui ${this.state.layout === layout ? 'disabled active' : ''} vertical animated icon button`;
    return (
      <div className="kitchen-inventory">
        <div className="header">
          <div className="ui grid">
            <div className="row">
              <div className="ui four wide column">
                <div className="ui basic fluid buttons">
                  <div className={layoutClassName('Cards')} tabIndex="0" onClick={(ev) => this.toggleLayout(ev)}>
                    <div className="hidden content">Cards</div>
                    <div className="visible content">
                      <i className="grid layout icon"/>
                    </div>
                  </div>
                  <div className={layoutClassName('List')} tabIndex="0" onClick={(ev) => this.toggleLayout(ev)}>
                    <div className="hidden content">List</div>
                    <div className="visible content">
                      <i className="list layout icon"/>
                    </div>
                  </div>
                </div>
              </div>
              <div className="ui twelve wide column">
                <div className="ui basic fluid buttons zone-buttons">
                  { zoneButtons }
                </div>
              </div>
            </div>

            <div className="row">
              <div className="ui sixteen wide column">
                <div className="ui basic fluid buttons category-buttons">
                  { categoryButtons }
                </div>
              </div>
            </div>


          </div>



        </div>
        <div className="content">
          { inventory }
        </div>
        <div className="footer">
          <Link to="/kitchen/new">
            <button className="ui large purple button">Add Item</button>
          </Link>
        </div>
      </div>
    );
  }
}

export default KitchenInventory;
