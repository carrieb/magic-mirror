import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';

import { Link } from 'react-router-dom';

import { KitchenStat, withKitchen } from 'state/KitchenState';

import KitchenItemCard from 'components/kitchen/kitchen-item-card.react';

import { withShoppingList } from 'components/shared/shopping-list.react';

import _sortBy from 'lodash/sortBy';
import _isEmpty from 'lodash/isEmpty';
import _values from 'lodash/values';

import 'sass/kitchen/kitchen-dashboard.scss';

class KitchenDashboard extends React.Component {
  constructor(props) {
    super(props);

    this.expiringSoonItems = this.expiringSoonItems.bind(this);
    this.starredItems = this.starredItems.bind(this);
  }

  expiringSoonItems() {
    const now = moment();
    const items = _values(this.props.kitchenIndex);
    // TODO: this should really include a "last acquired date" to determine what's going bad
    // requires storing/sending it on the server end
    return _sortBy(items, (item) => {
      const expiration = item.expiration || {};
      if (!_isEmpty(expiration)) {
        const expireDate = now.add(expiration.length, expiration.delta + 's');
        return expireDate.unix();
      } else {
        return now.unix();
      }
    });
  }

  starredItems() {
    const items = _values(this.props.kitchenIndex);
    const filtered = items.filter((item) => item.starred);
    console.log('starred:', filtered)
    return filtered;
  }

  componentDidMount() {
    $('.ui.accordion').accordion();
  }

  render() {
    let expiringSoonItems;

    const expiringItems = this.expiringSoonItems().map((item, i) => {
      if (i < 10) {
        // TODO: pass in star handler?
        return <KitchenItemCard key={`expiring_soon_${i}`}
                                foodItem={item}
                                id={item._id || 'fake id'}
                                handlePlusClick={this.props.addToShoppingList}/>
      }
      else {
        return null;
      }
    });

    expiringSoonItems = <div className="ui five doubling cards">{ expiringItems }</div>;

    const starredItems = this.starredItems().map((item, i) => {
      if (i < 10) {
        // TODO: pass in star handler?
        return <KitchenItemCard key={`starred_${i}`}
                                id={item._id || 'fake id'}
                                foodItem={item}/>
      }
      else {
        return null;
      }
    });

    return (
      <div className="kitchen-dashboard-wrapper">
        <div className="ui fluid vertical accordion menu expiring-soon">
          <div className="item">
            <a className="title">
              <i className="dropdown icon"/>
              <h2>
                <i className="red warning sign icon"/>
                Expiring Soon
              </h2>
            </a>

            <div className="content">
              { }
            </div>
          </div>
        </div>

        <div className="ui fluid vertical accordion menu starred">
          <div className="item">
            <a className="title">
              <i className="dropdown icon"/>
              <h2>
                <i className="yellow star icon"/>
                Starred
              </h2>
            </a>

            <div className="content">
              { starredItems }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withShoppingList(withKitchen(KitchenDashboard));
