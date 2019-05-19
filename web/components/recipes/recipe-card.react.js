import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import Directions from 'components/recipes/directions/directions-display.react';
import Ingredients from 'components/recipes/ingredients/ingredients-display.react';

import _noop from 'lodash/noop';
import _flatten from 'lodash/flatten';
import _sortBy from 'lodash/sortBy';
import _uniq from 'lodash/uniq';
import _uniqueId from 'lodash/uniqueId';
import _isEmpty from 'lodash/isEmpty';

import { tr } from 'util/translation-util';

import 'sass/recipes/recipe-card.scss';

class RecipeCard extends React.Component {
  componentDidMount() {
    $('.ui.embed').embed();
  }

  onExpandClick = () => {
    const recipe = this.props.recipe;
    if (recipe._id) {
      this.props.history.push(`/recipes/r/${recipe._id}`);
    }
  }

  render() {
    const recipe = this.props.recipe;
    //console.log('recipe card render:', recipe);
    const ingredients = <Ingredients ingredients={recipe.ingredients}
                                     enableCollapse={this.props.enableCollapse}/>
    const directions = <Directions directions={recipe.directions}
                                   ingredients={recipe.ingredients}
                                   enableCollapse={this.props.enableCollapse}/>

    const textContent = (
      <div>
        { recipe.category && <div className="ui grey sub header category">{ recipe.category }</div> }
        { recipe.servings > 0 && <div className="ui grey sub header servings">{ recipe.servings } Servings</div> }
        { ingredients }
        { directions }
      </div>
    );

    const image = this.props.showImage && recipe.img ? <div className="ui medium centered rounded image">
      <img src={recipe.img}/>
    </div> : null;

    let responsiveContent;
    if (image) {
      responsiveContent = (
        <div className="ui grid">
          <div className="sixteen wide mobile eight wide tablet four wide computer column">{ image }</div>
          <div className="sixteen wide mobile eight wide tablet twelve wide computer column">{ textContent }</div>

        </div>
      );
    } else {
      responsiveContent = textContent;
    }

    // TODO: rework how image is done to work well with weird size images
    // on both desktop and mobile
    // move it into main content

    const content = (
      <div className="ui fluid card">
        <div className="content">
          <div className="header">
            <div className="actions">
              <i className="ui external alternate icon" onClick={this.onExpandClick}/>
            </div>
            { recipe.name || 'Unknown'}
          </div>
        </div>
        { (recipe.video && (recipe.video.indexOf('youtube.com') > -1 || recipe.video.indexOf('youtu.be') > -1)) && <div className="image">
          <div className="ui embed" data-url={recipe.video}/>
        </div> }
        <div className="content">{ responsiveContent }</div>
        { recipe.source && <div className="content">
          { recipe.source.indexOf('youtube.com') > -1 && <i className="ui red youtube play icon"/>}<a href={recipe.source}>{recipe.source}</a>
        </div> }
        <div className="extra content">
          <span className="right floated like" onClick={ this.props.promptToDelete }>
            <i className="trash icon"></i>
            Trash
          </span>
        </div>
      </div>
    );

    return (
      <div className="recipe-card">
        { content }
      </div>
    );
  }
}

RecipeCard.propTypes = {
  recipe: PropTypes.object.isRequired,
  enableCollapse: PropTypes.bool,
  showActions: PropTypes.bool,
  showImage: PropTypes.bool
}

RecipeCard.defaultProps = {
  recipe: {},
  enableCollapse: true,
  showActions: true,
  showImage: true
}

export default withRouter(RecipeCard);
