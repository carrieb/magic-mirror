import React from 'react';
import PropTypes from 'prop-types';

import nlp from 'compromise';

import SmartStep from 'components/recipes/directions/smart-step.react';

import _sortBy from 'lodash/sortBy';
import _uniq from 'lodash/uniq';
import _flatten from 'lodash/flatten';
import _uniqueId from 'lodash/uniqueId'

import { tr } from 'util/translation-util';

const MAX_ITEMS = 2;

class Directions extends React.Component {
  constructor(props) {
    super(props);
    this.toggleCollapse = this.toggleCollapse.bind(this);

    const ingredients = this.props.ingredients || [];
    const initialState = this.computeState(ingredients);
    initialState.collapsed = true;
    this.state = initialState;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.ingredients) {
      this.setState(this.computeState(nextProps.ingredients));
    }
  }

  computeState = (ingredients) => {
    console.log(ingredients);
    const ingredientSections = ingredients.map(section => section.items);
    const allIngredients = _flatten(ingredientSections);
    let allIngredientNames = allIngredients.map(item => {
        //return item.name;
        if (!item) return null;
        return item.name || item.description;
        // line below only works for 'en'
        //return nlp(item.name || item.description).nouns().toSingular().out('text').trim()
      });
    if (ingredients.length > 1) {
      allIngredientNames = allIngredientNames.concat(ingredients.map(section => section.name.toLowerCase()))
    }
    // console.log(allIngredients);
    const allIngredientsByName = {};
    allIngredients.forEach((ingr) => { allIngredientsByName[ingr.name || ingr.description] = ingr });
    const keywords = _sortBy(_uniq(allIngredientNames), keyword => keyword ? -keyword.length : 0);
    return { keywords, allIngredientsByName };
  }

  toggleCollapse() {
    this.setState({ collapsed: !this.state.collapsed });
  }

  render() {
    console.log(this.state.allIngredientsByName, this.state.keywords);

    //console.log('directions display keywords:', this.state.keywords);
    const directions = this.props.directions || [];
    //console.log(this.state.keywords);
    const directionEls = directions.map((directionsList, i) => {
      const title = <div className="ui sub header">{ directionsList.name || tr('recipes.fields.directions') }</div>;
      const steps = directionsList.steps || [];


      //console.log(tools);
      const stepEls = steps.map((step, idx) => {
        if ((this.props.enableCollapse) && (this.state.collapsed && idx >= MAX_ITEMS)) { return null };
        return <div className="item" key={idx}>
          <SmartStep step={step.content}
                     ingredients={this.props.ingredients}
                     keywords={this.state.keywords}
                     ingredientsByName={this.state.allIngredientsByName}/>
        </div>
      });

      return (
        <div className="content" key={i}>
          { title }
          <div className="ui ordered list">
            { stepEls }
          </div>
          { (this.props.enableCollapse && steps.length > MAX_ITEMS) &&
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

Directions.propTypes = {
  enableCollapse: PropTypes.bool
}

Directions.defaultProps = {
  enableCollapse: false
}

export default Directions;
