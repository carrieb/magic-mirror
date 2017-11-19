import React from 'react';
import PropTypes from 'prop-types';

function formatQuantity(quantity) {
  let amt = quantity.amount;
  if (amt === .25) { amt = '1/4'};
  if (amt === .5) { amt = '1/2'};
  return <span>{amt} {quantity.unit}{quantity.amount > 1 && 's'}</span>
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
    const els = this.props.ingredients.map((ingredientsList, i) => {
      let title = <div className="ui sub header">
        {ingredientsList.name ? ingredientsList.name : 'ingredients'}
      </div>
      let items = ingredientsList.items.map((item, idx) => {
        if (this.state.collapsed && idx >= 2) { return null };
        return <div className="item" key={idx}>
          <b>{formatQuantity(item.quantity)}</b> of {item.modifier} <a href={`/kitchen/${item.name}`}>{item.name}</a>
        </div>
      });
      return (
        <div className="ingredients-section" key={i}>
          { title }
          <div className="ui list">
            { items }
          </div>
          { items.length > 2 &&
            <div className="collapse-toggle" onClick={this.toggleCollapse}>
              <i className={`ui grey icon ${this.state.collapsed ? 'ellipsis horizontal' : 'minus' }`}/>
            </div>
          }
        </div>
      );
    });

    return (
      <div>{els}</div>
    );
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
    const directionEls = directions.map((directionsList, j) => {
      let title = <div className="ui sub header">{directionsList.name ? directionsList.name : 'directions'}</div>;
      const steps = directionsList.steps || [];
      let stepEls = steps.map((step, idx) => {
        if (this.state.collapsed && idx >= 2) { return null };
        return <div className="item" key={idx}>{step.content}</div>
      });
      return (
        <div className="content" key={j}>
          { title }
          <div className="ui ordered list">
            { stepEls }
          </div>
          { steps.length > 2 &&
            <div className="collapse-toggle" onClick={this.toggleCollapse}>
              <i className={`ui grey icon ${this.state.collapsed ? 'ellipsis horizontal' : 'minus' }`}/>
            </div>
          }
        </div>
      );
    });

    return <div>{ directionEls }</div>;
  }
}

class RecipeCard extends React.Component {
  render() {
    const recipe = this.props.recipe;
    console.log(recipe);
    const ingredients = <Ingredients ingredients={recipe.ingredients}/>
    const directions = <Directions directions={recipe.directions}/>
    const content = (
      <div className="ui card">
        <div className="content">
          <div className="header">
            {recipe.name}
            <span className="grey-text right floated">{recipe.servings}<i className="ui grey icon food"/></span>
          </div>
        </div>
        <div className="image" style={{ borderTop: '1px solid rgba(34,36,38,.1)'}}>
          <img src={recipe.img}/>
        </div>
        <div className="content">
          { ingredients }
        </div>
        <div className="content">
          { directions }
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
  recipe: PropTypes.object.isRequired
}

export default RecipeCard;
