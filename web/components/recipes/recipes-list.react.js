 import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import RecipeCard from 'components/recipes/recipe-card.react';
import { withRecipes } from 'state/RecipesState';

import _isEqual from 'lodash/isEqual';
import _isEmpty from 'lodash/isEmpty';
import _concat from 'lodash/concat';
import _noop from 'lodash/noop';

import 'sass/recipes/list.scss';

class RecipesList extends React.Component {
  onEditClick = (i) => {
    return () => {
      const recipe = this.props.recipes[i];
      this.props.history.push(`/recipes/r/${recipe._id}/edit`);
    }
  }

  onCardClick = (i) => {
    return () => {
      //console.log(i);
      const recipes = this.props.recipes;
      const before = recipes.slice(0, i+1);
      const after = recipes.slice(i+1);
      //console.log(before, after);
      this.setState({ recipes: _concat(after, before) });
    }
  }

  onAddClick = (i) => {
    return () => {
      const recipes = this.props.recipes;
      const recipe = recipes[i];
      this.props.addRecipeToList(recipe);
    }
  }

  onExpandClick = (i) => {
    return () => {
      const recipe = this.props.recipes[i];
      this.props.history.push(`/recipes/r/${recipe._id}`);
    }
  }

  componentDidMount() {
    if (!_isEmpty(this.props.recipes)) {
      this.loadFullCardSlick();
      this.loadPreviewsSlick();
    }
  }

  componentDidUpdate(prevProps) {
    if (!_isEqual(prevProps.recipes, this.props.recipes)) {
      this.loadFullCardSlick();
      this.loadPreviewsSlick();
    }
  }

  loadFullCardSlick = () => {
    $('.api-recipes-list').slick({
      arrows: false,
      adaptiveHeight: true,
      asNavFor: '.previews-list'
    });
  }

  loadPreviewsSlick = () => {
    $('.previews-list').slick({
      arrows: true,
      centerMode: true,
      centerPadding: '60px',
      slidesToShow: 5,
      asNavFor: '.api-recipes-list',
      responsive: [
        {
          breakpoint: 1000,
          settings: {
            arrows: true,
            centerMode: true,
            centerPadding: '40px',
            slidesToShow: 3
          }
        },
        {
          breakpoint: 500,
          settings: {
            arrows: true,
            centerMode: true,
            centerPadding: '20px',
            slidesToShow: 1
          }
        }
      ]
    });
  }

  render() {
    const recipeCards = this.props.recipes.map((recipe, i) =>
      <div key={i}>
        <RecipeCard recipe={recipe}
                  enableCollapse={false}
                  onExpandClick={this.onExpandClick(i)}
                  onAddClick={this.onAddClick(i)}
                  onEditClick={this.onEditClick(i)}
                  onCardClick={this.onCardClick(i)}/>
      </div>
    );

    const previews = this.props.recipes.map((recipe, i) =>
      <div key={i}>
        <h3>{ recipe.name }</h3>
      </div>
    );

    return (
      <div>
        <div className="previews-list">
          { previews }
        </div>
        <div className="api-recipes-list">
          { recipeCards }
        </div>
      </div>
    );
  }
}

export default withRouter(withRecipes(RecipesList));
