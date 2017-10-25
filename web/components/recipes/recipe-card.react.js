import React from 'react';
import PropTypes from 'prop-types';

class Ingredients extends React.Component {
  render() {
    const els = this.props.ingredients.map((ingredientsList, i) => {
      let title = <div className="ui sub header">
        {ingredientsList.name ? ingredientsList.name : 'ingredients'}
      </div>
      let items = ingredientsList.items.map((item, idx) => {
        return <div className="item" key={idx}><b>{item.quantity}</b> of <a href={`/kitchen/${item.name}`}>{item.name}</a></div>
      });
      return (
        <div className="ingredients-section" key={i}>
          { title }
          <div className="ui list">
            { items }
          </div>
        </div>
      );
    });

    return (
      <div>{els}</div>
    );
  }
}

class Directions extends React.Component {
  render() {
    const directions = this.props.directions.map((directionsList, j) => {
      let title = <div className="ui sub header">{directionsList.name ? directionsList.name : 'directions'}</div>;
      let steps = directionsList.steps.map((step, idx) => {
        return <div className="item" key={idx}>{step.content}</div>
      });
      return (
        <div className="content" key={j}>
          { title }
          <div className="ui ordered list">
            { steps }
          </div>
        </div>
      );
    });

    return <div>{ directions }</div>;
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
          <div className="header">{recipe.name}</div>
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
