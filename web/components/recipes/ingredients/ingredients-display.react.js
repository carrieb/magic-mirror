import React from 'react';
import PropTypes from 'prop-types';

import IngredientsList from 'components/recipes/ingredients/ingredients-list.react';



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

Ingredients.propTypes = {
  enableCollapse: PropTypes.bool
}

Ingredients.defaultProps = {
  enableCollapse: false
}

export default Ingredients;
