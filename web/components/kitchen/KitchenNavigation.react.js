import React from 'react';

import { withRouter } from 'react-router';

import { NavLink } from 'react-router-dom';

import 'sass/kitchen/kitchen-navigation.scss';

class KitchenNavigation extends React.Component {
  headerClassName = (route, subroute=false) => {
    const classList = ['header', 'item'];
    if (this.props.location.pathname.startsWith(route)) {
      classList.push('active');
    }
    if (subroute) {
      classList.push('subheader');
    }
    return classList.join(' ');
  };

  routeHeaderItem = (route, name, subroute=false) => (
    <div className={this.headerClassName(route, subroute)}>
      <NavLink to={route}>{ name }</NavLink>
    </div>
  );


  render() {
    return (
      <div className="ui secondary menu kitchen-navigation">
        { this.routeHeaderItem('/kitchen', 'Kitchen') }
        { this.routeHeaderItem('/kitchen/inventory', 'Inventory', true) }
        <div className="header item">
          <a href="/recipes">Recipes</a>
        </div>
        <div className="right menu">
          <a className="item" href="/process-receipt">
            <i className="icons icon">
              <i className="shopping  basket icon"/>
              <i className="inverted corner upload icon"/>
            </i>
            Upload Items From Receipt
          </a>
        </div>
      </div>
    );
  }
}

export default withRouter(KitchenNavigation);
