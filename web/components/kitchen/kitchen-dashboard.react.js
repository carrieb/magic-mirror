import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';

import { Link } from 'react-router-dom';

import KitchenState from 'state/KitchenState';

import KitchenItemCard from 'components/kitchen/kitchen-item-card.react';

import { withShoppingList } from 'components/shared/shopping-list.react';

import _sortBy from 'lodash/sortBy';
import _isEmpty from 'lodash/isEmpty';

import 'sass/kitchen/kitchen-dashboard.scss';

class KitchenDashboard extends React.Component {
  constructor(props) {
    super(props);

    this.expiringSoonItems = this.expiringSoonItems.bind(this);
    this.starredItems = this.starredItems.bind(this);

    this.state = { items: [], loaded: false };
  }

  componentWillMount() {
    KitchenState.getKitchen((items) => {
      this.setState({ items, loaded: true });
    })
  }

  expiringSoonItems() {
    // TODO: use expiration and now
    // to determine and end timestamp
    // sort those in ASC order
    // get top 5
    const now = moment();
    return _sortBy(this.state.items, (item) => {
      const expiration = item.expiration || {};
      if (!_isEmpty(expiration)) {
        const expireDate = now.add(expiration.length, expiration.delta + 's');
        console.log(expireDate);
        return expireDate.unix();
      } else {
        console.log('now', now);
        return now.unix();
      }
    });
  }

  starredItems() {
    // TODO: use 'starred' flag
    // sort by 'normal'? (arbitrary for now?)
    return this.state.items.filter((item) => item.starred);
  }

  render() {
    const loader = <div className="ui text loader">Loading...</div>;
    console.log(this.state.items);

    let expiringSoonItems;
    let starredItems;

    if (!this.state.loading) {
      const expiringItems = this.expiringSoonItems().map((item, i) => {
        if (i < 10) {
          // TODO: pass in star handler?
          return <KitchenItemCard key={`expiring_soon_${i}`}
                                  foodItem={item}/>
        }
        else {
          return null;
        }
      });
      expiringSoonItems = <div className="ui five cards">{ expiringItems }</div>;

      const starredItems = this.starredItems().map((item, i) => {
        if (i < 10) {
          // TODO: pass in star handler?
          return <KitchenItemCard key={`starred_${i}`}
                                  foodItem={item}/>
        }
        else {
          return null;
        }
      });
    }

    return (
      <div className="kitchen-dashboard-wrapper">
        <Link to="/kitchen/inventory">
          <button className="ui basic fluid button">Inventory</button>
        </Link>
        <div className="ui segment">
          <h2 className="ui header">
            <i className="red warning sign icon"/>
            Expiring Soon
          </h2>
          { this.state.loading && loader }
          { expiringSoonItems }
        </div>
        <div className="ui segment">
          <h2 className="ui header">
            <i className="yellow star icon"/>
            Starred
          </h2>
          { this.state.loading && loader }
        </div>
      </div>
    )
  }
}

export default withShoppingList(KitchenDashboard);
