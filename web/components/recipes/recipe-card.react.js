import React from 'react';
import PropTypes from 'prop-types';

import _noop from 'lodash/noop';

import 'sass/recipes/recipe-card.scss';

class Ingredient extends React.Component {
  render() {
    const item = this.props.item;
    let q = item.quantity || {};
    const remainder = q.amount - Math.floor(q.amount);
    const whole = q.amount - remainder;
    let amt = whole === 0 ? '' : whole + ' ';
    if (remainder === .75) { amt += '3/4 '; }
    if (remainder === .33) { amt += '1/3 '; }
    if (remainder === .25) { amt += '1/4 '; }
    if (remainder === .5) { amt += '1/2 '; }
    const quantity = <span>{amt}{q.unit}{(q.amount > 1 && q.unit)&& 's'}</span>;
    return (
      <span>
        <b>{quantity}</b>{q.unit && ' of '}{item.modifier} <a href={`/kitchen/${item.name}`}>{item.name}</a>
      </span>
    );
  }
}

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
    const ingrEls = ingredients.map((ingredientsList, i) => {
      let shouldCollapse = (this.props.enableCollapse && (this.state.collapsed && counter > 2));
      const title = !shouldCollapse && <div className="ui grey sub header">{ingredientsList.name || 'ingredients'}</div>;
      const items = ingredientsList.items || [];

      let itemEls = items.map((item, idx) => {
        shouldCollapse = (this.props.enableCollapse && (this.state.collapsed && counter > 2));
        counter++;
        if (shouldCollapse) { return null; }
        return <div className="item" key={idx}>
          <Ingredient item={item}/>
        </div>;
      });

      return (
        <div className="ingredients-section" key={i}>
          { title }
          <div className="ui list">
            { itemEls }
          </div>
        </div>
      );
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
    this.state = { collapsed: true };
  }

  toggleCollapse() {
    this.setState({ collapsed: !this.state.collapsed });
  }

  render() {
    const directions = this.props.directions || [];
    const directionEls = directions.map((directionsList, i) => {
      const title = <div className="ui grey sub header">{ directionsList.name || 'drections' }</div>;
      const steps = directionsList.steps || [];

      const stepEls = steps.map((step, idx) => {
        if ((this.props.enableCollapse) && (this.state.collapsed && idx >= 2)) { return null };
        return <div className="item" key={idx}>{step.content}</div>
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
    console.log(recipe);
    const ingredients = <Ingredients ingredients={recipe.ingredients} enableCollapse={this.props.enableCollapse}/>
    const directions = <Directions directions={recipe.directions} enableCollapse={this.props.enableCollapse}/>
    const content = (
      <div className="ui card">
        <div className="content">
          <div className="header">
            {recipe.name}
            { recipe.servings && <span className="grey-text right floated">{recipe.servings}<i className="ui grey icon food"/></span> }
          </div>
        </div>
        { (this.props.showImage && recipe.img) && <div className="image" style={{ borderTop: '1px solid rgba(34,36,38,.1)'}}>
          <img src={recipe.img}/>
        </div> }
        { recipe.source && <div className="image">
          <div className="ui embed" data-url={recipe.source}/>
        </div> }
        { this.props.showActions && <div className="content actions">
          <i className="ui right floated edit icon" onClick={this.props.onEditClick}/>
          <i className="ui right floated maximize icon" onClick={this.props.onMaximizeClick}/>
        </div> }
        <div className="content">
          { ingredients }
        </div>
        <div className="content">
          { directions }
        </div>
        { recipe.source && <div className="content">
          { recipe.source.indexOf('youtube.com') > -1 && <i className="ui red youtube play icon"/>}<a href={recipe.source}>{recipe.source}</a>
        </div> }
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
  showImage: PropTypes.bool,
  onMaximizeClick: PropTypes.func,
  onEditClick: PropTypes.func
}

RecipeCard.defaultProps = {
  recipe: {},
  enableCollapse: true,
  showActions: true,
  showImage: true,
  onMaximizeClick: _noop,
  onEditClick: _noop
}

export default RecipeCard;
