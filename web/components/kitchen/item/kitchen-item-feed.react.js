import React from 'react';
import PropTypes from 'prop-types';

class KitchenItemFeed extends React.Component {
  render() {
    const item = this.props.item;
    const name = item.description || item.name;
    return (
      <div className="kitchen-item-feed">
        <div className="ui feed">
          <div className="event">
            <div className="content">
              <div className="summary">
                <a>{ name }</a> created. <div className="date">1/1/01</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

KitchenItemFeed.propTypes = {
  item: PropTypes.object
}

KitchenItemFeed.defaultProps = {
  item: {}
}

export default KitchenItemFeed;
