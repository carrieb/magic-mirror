import React from 'react';
import { NavLink } from 'react-router-dom';

class RecipesNavigation extends React.Component {
  render() {
    return (
      <div className="ui secondary menu recipes-navigation">
        <div className="header active item">
          <NavLink to="/recipes">Recipes</NavLink>
        </div>
        <div className="header item">
          <a href="/kitchen">Kitchen</a>
        </div>
        <div className="right menu">
          <div className="item">
            <NavLink to="/recipes/import">
              <i className="icons icon">
                <i className="browser icon"/>
                <i className="inverted corner upload icon"/>
              </i>
              Import Recipe
            </NavLink>
          </div>
        </div>
      </div>
    );
  }
}

export default RecipesNavigation;
