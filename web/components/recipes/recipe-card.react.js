import React from 'react';
import PropTypes from 'prop-types';

import IngredientsList from 'components/recipes/ingredients-list.react';

import _noop from 'lodash/noop';
import _flatten from 'lodash/flatten';
import _sortBy from 'lodash/sortBy';
import _uniq from 'lodash/uniq';
import _uniqueId from 'lodash/uniqueId';

import 'sass/recipes/recipe-card.scss';

const MAX_ITEMS = 3;

class Ingredients extends React.Component {
  constructor(props) {
    super(props);
    this.toggleCollapse = this.toggleCollapse.bind(this);
    this.state = { collapsed: true }
  }

  toggleCollapse() {
    this.setState({ collapsed: !this.state.collapsed });
  }

  render() {
    const ingredients = this.props.ingredients || [];
    let counter = 0;
    const ingrEls = ingredients.map((section, i) => {
      const ingredients = section.items || [];
      let shouldCollapse = this.props.enableCollapse && this.state.collapsed;
      if (shouldCollapse && counter > MAX_ITEMS) {
        return null;
      } else {
        const title = <div className="ui grey sub header">{section.name || 'ingredients'}</div>;
        counter+=ingredients.length;
        return (
          <div className="ingredients-section" key={i}>
            { title }
            <IngredientsList items={ingredients} maxItems={ shouldCollapse ? MAX_ITEMS : 100000}/>
          </div>
        );
      }
    });

    return <div className="ingredients-wrapper">
      { ingrEls }
      { (this.props.enableCollapse && counter > 3) &&
        <div className="collapse-toggle" onClick={this.toggleCollapse}>
          <i className={`ui grey icon ${this.state.collapsed ? 'ellipsis horizontal' : 'minus' }`}/>
        </div>
      }
    </div>;
  }
}

class Directions extends React.Component {
  constructor(props) {
    super(props);
    this.toggleCollapse = this.toggleCollapse.bind(this);

    const ingredients = this.props.ingredients || [];
    const keywords = _sortBy(_uniq(_flatten(ingredients.map((section) => section.items))
      .map((item) => item.name)), (keyword) => -keyword.length);
    this.state = { collapsed: true, keywords };
  }

  componentWillReceiveProps(nextProps) {
    const keywords = _sortBy(_uniq(_flatten(nextProps.ingredients.map((section) => section.items))
      .map((item) => item.name)), (keyword) => -keyword.length);
    this.setState({ keywords });
  }

  toggleCollapse() {
    this.setState({ collapsed: !this.state.collapsed });
  }

  highlightKeywords(text) {
    //console.log(text, this.state.keywords);
    const keywords = this.state.keywords || [];
    let result = [];
    let matched = [];
    keywords.forEach((keyword) => {
      const regex = new RegExp(keyword);
      const match = text.match(regex);
      if (match) {
        //console.log(text, keyword);
        matched.push(keyword);
      }
    });

    if (matched.length > 0) {
      const splitRegex = new RegExp(`(${matched.join('|')})`);
      const split = text.split(splitRegex);
      //console.log(split);
      split.forEach((words) => {
        if (matched.indexOf(words) > -1) {
          // TODO: somehow link it with the correct amount from
          // ingredients.
          // using the section name?
          result.push(<a href={`/kitchen/${words}`} key={_uniqueId()}>{words}</a>);
        } else {
          result.push(words);
        }
      });
    } else {
      return text;
    }

    return result;
  }

  render() {
    const directions = this.props.directions || [];
    const directionEls = directions.map((directionsList, i) => {
      const title = <div className="ui grey sub header">{ directionsList.name || 'directions' }</div>;
      const steps = directionsList.steps || [];

      const stepEls = steps.map((step, idx) => {
        if ((this.props.enableCollapse) && (this.state.collapsed && idx >= 2)) { return null };
        return <div className="item" key={idx}>{this.highlightKeywords(step.content)}</div>
      });

      return (
        <div className="content" key={i}>
          { title }
          <div className="ui ordered list">
            { stepEls }
          </div>
          { (this.props.enableCollapse && steps.length > 2) &&
            <div className="collapse-toggle" onClick={this.toggleCollapse}>
              <i className={`ui grey icon ${this.state.collapsed ? 'ellipsis horizontal' : 'minus' }`}/>
            </div>
          }
        </div>
      );
    });

    return <div className="directions-wrapper">{ directionEls }</div>;
  }
}

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
            <i className="ui maximize icon" onClick={this.props.onMaximizeClick}/>
            <i className="ui plus icon" onClick={this.props.onAddClick}/>
          </div> }
          { recipe.servings && <span className="grey-text right floated">{recipe.servings}<i className="ui grey icon food"/></span> }

            {recipe.name}


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
  onMaximizeClick: PropTypes.func,
  onEditClick: PropTypes.func,
  onCardClick: PropTypes.func,
  onAddClick: PropTypes.func
}

RecipeCard.defaultProps = {
  recipe: {},
  enableCollapse: true,
  showActions: true,
  showImage: true,
  onMaximizeClick: _noop,
  onEditClick: _noop,
  onCardClick: _noop,
  onAddClick: _noop
}

export default RecipeCard;
