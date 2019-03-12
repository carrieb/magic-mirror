import React from 'react';

import { withRouter } from 'react-router';
import ChangeHlDropdown from 'components/shared/change-hl-dropdown.react';

import SearchItemsByNameDropdown from 'components/kitchen/search-items-by-name-dropdown.react';

import { NavLink } from 'react-router-dom';

import { tr } from 'util/translation-util';

import 'sass/kitchen/kitchen-navigation.scss';

class KitchenNavigation extends React.Component {

  headerClassName = (route, subroute=false) => {
    const classList = ['item'];

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
      <NavLink to={route}>{ tr(`nav.${name.toLowerCase()}`) }</NavLink>
    </div>
  );


  render() {
    return (
      <div className="ui stackable secondary menu kitchen-navigation">
        <div className="ui simple dropdown item">
          Kitchen
          <i className="dropdown icon"/>
          <div className="menu">
            <a className="item">Inventory</a>
            <a className="item">Import</a>
          </div>
        </div>
        <div className="item">
          <a href="/recipes">{ tr(`nav.recipes`) }</a>
        </div>
        <div className="item">
          <a href="/meals">{ tr(`nav.meals`) }</a>
        </div>
        <div className="right menu">
          <a className="item" href="/process-receipt">
            <i className="icons icon">
              <i className="shopping  basket icon"/>
              <i className="inverted corner upload icon"/>
            </i>
            { tr(`nav.actions.import`) }
          </a>
          <div className="item" style={{ padding: 0 }}>
            <SearchItemsByNameDropdown/>
          </div>
          <div className="item" style={{ padding: 0 }}>
            <ChangeHlDropdown/>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(KitchenNavigation);
