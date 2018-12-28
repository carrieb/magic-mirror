import React from 'react';
import PropTypes from 'prop-types';

import nlp from 'compromise';

import SmartStep from 'components/recipes/directions/smart-step.react';

import _sortBy from 'lodash/sortBy';
import _uniq from 'lodash/uniq';
import _flatten from 'lodash/flatten';
import _uniqueId from 'lodash/uniqueId'

const MAX_ITEMS = 2;

class Directions extends React.Component {
  constructor(props) {
    super(props);
    this.toggleCollapse = this.toggleCollapse.bind(this);

    const ingredients = this.props.ingredients || [];

    const ingredientSections = ingredients.map(section => section.items);
    let allIngredients = _flatten(ingredientSections)
      .map(item => {
        //return item.name;
        if (!item) return null;
        return nlp(item.name || item.description).nouns().toSingular().out('text').trim()
      });
    if (ingredients.length > 1) {
      allIngredients = allIngredients.concat(ingredients.map(section => section.name.toLowerCase()))
    }
    const keywords = _sortBy(_uniq(allIngredients), keyword => keyword ? -keyword.length : 0);

    this.state = { collapsed: true, keywords };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.ingredients) {
      const ingredientSections = nextProps.ingredients.map(section => { const l = section.items; l.push(section.name); return l });
      let allIngredients = _flatten(ingredientSections)
        .map(item => {
          if (!item) return null;
          return nlp(item.name || item.description).nouns().toSingular().out('text').trim()
        });
      if (nextProps.ingredients.length > 1) {
        allIngredients = allIngredients.push(nextProps.ingredients.map(section => section.name.toLowerCase()))
      }
      const keywords = _sortBy(_uniq(allIngredients), keyword => keyword ? -keyword.length : 0);
      this.setState({ keywords });
    }
  }

  toggleCollapse() {
    this.setState({ collapsed: !this.state.collapsed });
  }

  render() {
    const directions = this.props.directions || [];
    //console.log(this.state.keywords);
    const directionEls = directions.map((directionsList, i) => {
      const title = <div className="ui sub header">{ directionsList.name || 'directions' }</div>;
      const steps = directionsList.steps || [];

      const stepEls = steps.map((step, idx) => {
        if ((this.props.enableCollapse) && (this.state.collapsed && idx >= MAX_ITEMS)) { return null };
        return <div className="item" key={idx}>
          <SmartStep step={step.content} keywords={this.state.keywords}/>
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
