import React from 'react';
import PropTypes from 'prop-types';

import Directions from 'components/recipes/directions/directions-display.react';
import Ingredients from 'components/recipes/ingredients/ingredients-display.react';

import _noop from 'lodash/noop';
import _flatten from 'lodash/flatten';
import _sortBy from 'lodash/sortBy';
import _uniq from 'lodash/uniq';
import _uniqueId from 'lodash/uniqueId';

import 'sass/recipes/recipe-card.scss';

class RecipeCard extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    $('.ui.embed').embed();
  }

  render() {
    const recipe = this.props.recipe;
    //console.log(recipe);
    const ingredients = <Ingredients ingredients={recipe.ingredients} enableCollapse={this.props.enableCollapse}/>
    const directions = <Directions directions={recipe.directions}
                                   ingredients={recipe.ingredients}
                                   enableCollapse={this.props.enableCollapse}/>
    let innerContent;
    if (this.props.showImage) {
      innerContent = (
        <div className="content">
          <div className="ui grid">
            <div className="four wide column">
              <img src={recipe.img}/>
            </div>
            <div className="twelve wide column">
              { ingredients }
              { directions }
            </div>
          </div>
        </div>
      );
    } else {
      innerContent = (
        <div className="content">
          { ingredients }
          { directions }
        </div>
      )
    }
    const content = (
      <div className="ui fluid card">
        <div className="content">

          <div className="header">
            { this.props.showActions && <div className="actions">
              <i className="ui edit icon" onClick={this.props.onEditClick}/>
              <i className="ui maximize icon" onClick={this.props.onExpandClick}/>
              <i className="ui plus icon" onClick={this.props.onAddClick}/>
            </div> }
            { recipe.servings > 0 && <span className="grey-text right floated">{recipe.servings}<i className="ui grey icon food"/></span> }

            {recipe.name || ''}


          </div>
        </div>
        { /* todo: toggle when we add this */ }
        { (recipe.source && false) && <div className="image">
          <div className="ui embed" data-url={recipe.source}/>
        </div> }
        { innerContent }
        { recipe.source && <div className="content">
          { recipe.source.indexOf('youtube.com') > -1 && <i className="ui red youtube play icon"/>}<a href={recipe.source}>{recipe.source}</a>
        </div> }
      </div>
    );

    return (
      <div className="recipe-card" onClick={this.props.onCardClick}>
        { content }
      </div>
    );
  }
}

RecipeCard.propTypes = {
  recipe: PropTypes.object.isRequired,
  enableCollapse: PropTypes.bool,
  showActions: PropTypes.bool,
  showImage: PropTypes.bool,
  onExpandClick: PropTypes.func,
  onEditClick: PropTypes.func,
  onCardClick: PropTypes.func,
  onAddClick: PropTypes.func
}

RecipeCard.defaultProps = {
  recipe: {},
  enableCollapse: true,
  showActions: true,
  showImage: true,
  onExpandClick: _noop,
  onEditClick: _noop,
  onCardClick: _noop,
  onAddClick: _noop
}

export default RecipeCard;
