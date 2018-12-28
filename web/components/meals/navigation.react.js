import React from 'react';
import { NavLink } from 'react-router-dom';

import { tr, setLocale } from 'util/translation-util';

import ChangeHlDropdown from 'components/shared/change-hl-dropdown.react';

class MealsNavigation extends React.Component {
  render() {
    return (
      <div className="ui secondary menu meals-navigation">
        <div className="header active item">
          <NavLink to="/meals">{ tr('nav.meals') }</NavLink>
        </div>
        <div className="header item">
          <a href="/recipes">{ tr('nav.recipes') }</a>
        </div>
        <div className="header item">
          <a href="/kitchen">{ tr('nav.kitchen') }</a>
        </div>
        <div className="right header item">
          <ChangeHlDropdown/>
        </div>
      </div>
    );
  }
}

export default MealsNavigation;
