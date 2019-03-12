import React from 'react';
import { NavLink } from 'react-router-dom';

import ChangeHlDropdown from 'components/shared/change-hl-dropdown.react';

import { tr } from 'util/translation-util';

import 'sass/recipes/navigation.scss';

class RecipesNavigation extends React.Component {
  render() {
    return (
      <div className="ui secondary menu recipes-navigation">
        <div className="header active item">
          <NavLink to="/recipes">{ tr('nav.recipes') }</NavLink>
        </div>
        <div className="header item">
          <a href="/kitchen">{ tr('nav.kitchen') }</a>
        </div>
        <div className="header item">
          <a href="/meals">{ tr('nav.meals') }</a>
        </div>
        <div className="right menu">
          <div className="item">
            <NavLink to="/recipes/import">
              <i className="icons icon">
                <i className="browser icon"/>
                <i className="inverted corner upload icon"/>
              </i>
              { tr('nav.actions.import') }
            </NavLink>
          </div>

          <div className="item">
            <NavLink to="/recipes/add">
              <i className="icons icon">
                <i className="browser icon"/>
                <i className="inverted corner plus icon"/>
              </i>
              { tr('nav.actions.add') }
            </NavLink>
          </div>

          <div className="item" style={{ padding: 0 }}>
            <ChangeHlDropdown/>
          </div>
        </div>
      </div>
    );
  }
}

export default RecipesNavigation;
