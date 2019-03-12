 import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import RecipeCard from 'components/recipes/recipe-card.react';
import { withRecipes } from 'state/RecipesState';

import LocalStorageUtil from 'util/local-storage-util';

import _isEqual from 'lodash/isEqual';
import _isEmpty from 'lodash/isEmpty';
import _concat from 'lodash/concat';
import _noop from 'lodash/noop';
import _findIndex from 'lodash/findIndex';

import 'sass/recipes/list.scss';

class RecipesList extends React.Component {
  componentDidMount() {
    if (!_isEmpty(this.props.recipes)) {
      this.loadPreviewsSlick();
      this.loadFullCardSlick();
    }
  }

  componentDidUpdate(prevProps) {
    if (!_isEqual(prevProps.recipes, this.props.recipes)) {
      this.loadPreviewsSlick();
      this.loadFullCardSlick();
    }
  }

  loadFullCardSlick = () => {
    $('.api-recipes-list').slick({
      arrows: false,
      adaptiveHeight: true,
      asNavFor: '.previews-list',
      draggable: false,
      touchMove: false,
    });

    $('.api-recipes-list').on('afterChange', (ev, slick, currentSlide) => {
      const currentRecipe = this.props.recipes[currentSlide];
      //console.log(currentRecipe, currentRecipe._id);
      if (currentRecipe && currentRecipe._id) {
        LocalStorageUtil.saveFieldForComponent('RecipeList', 'currentRecipeId', currentRecipe._id);
      }
    });

    const idFromLastSession = LocalStorageUtil.getFieldForComponent('RecipeList', 'currentRecipeId');
    console.log('id from last session:', idFromLastSession);
    if (idFromLastSession && this.props.recipesIndex[idFromLastSession]) {
      const recipe = this.props.recipesIndex[idFromLastSession];
      const idx = _findIndex(this.props.recipes, (item) => item._id === recipe._id);
      //console.log(recipe, idx);
      $('.api-recipes-list').slick('slickGoTo', idx, true);
    }
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
            arrows: false,
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
                  enableCollapse={false}/>
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
