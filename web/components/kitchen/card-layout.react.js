import React from 'react';
import PropTypes from 'prop-types';

import KitchenItemCard from 'components/kitchen/kitchen-item-card.react';

import { withCategories } from 'components/common/hoc/withCategories.react';

class CardLayout extends React.Component {
  render() {
    if (!this.props.items || this.props.items.length === 0) {
      return (
        <div className="ui fluid card">
          <div className="content">Nothing in inventory.</div>
        </div>
      );
    } else {
      const cards = this.props.items.map((item, idx) => {
          return (
            <KitchenItemCard id={item._id || 'fake id'} key={item._id}/>
          );
      });

      return <div className="ui six doubling cards">{ cards }</div>;
    }
  }
}

export default withCategories(CardLayout);
