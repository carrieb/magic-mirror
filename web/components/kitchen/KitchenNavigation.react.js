import React from 'react';

import { NavLink } from 'react-router-dom';

class KitchenNavigation extends React.Component {
  render() {
    return (
      <div className="ui secondary menu kitchen-navigation">
        <div className="header active item">
          <NavLink to="/kitchen">Kitchen</NavLink>
        </div>
        <div className="right menu">
          <a className="item" href="/process-receipt">
            <i className="icons icon">
              <i className="shopping  basket icon"/>
              <i className="inverted corner upload icon"/>
            </i>
            Upload Receipt
          </a>
        </div>
      </div>
    );
  }
}

export default KitchenNavigation;