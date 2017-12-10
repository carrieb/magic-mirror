import React from 'react';
import PropTypes from 'prop-types';

import IngredientsList from 'components/recipes/ingredients-list.react';

import KitchenState from 'state/KitchenState';

import 'sass/shared/shopping-list.scss';

import _isEmpty from 'lodash/isEmpty';

import ApiWrapper from 'util/api-wrapper';

class ShoppingList extends React.Component {
  constructor(props) {
    super(props);
    this.toggleExpansion = this.toggleExpansion.bind(this);
    this.export = this.export.bind(this);
    this.state = { expanded: false, inventory: [] };
  }

  componentWillReceiveProps(nextProps) {
    if (!_isEmpty(nextProps.items)) {
      this.setState({ expanded: true });
    }
  }

  export() {
    ApiWrapper.exportShoppingList(this.props.items);
  }

  componentWillMount() {
    KitchenState.getKitchen((inventory) =>  {
      this.setState({ inventory });
    });
  }

  toggleExpansion() {
    this.setState({ expanded: !this.state.expanded });
  }

  render() {
    console.log('shopping list', this.state.inventory);
    return (
      <div className={`shopping-list ${this.state.expanded ? 'expanded' : ''}`}>
        <div className="ui fluid segment">
          <i className={`ui right floated ${this.state.expanded ? 'red minus' : 'green plus'} icon`}
             onClick={this.toggleExpansion}/>
          <div className="content">
            <div className="ui sub header">Shopping List</div>
            <IngredientsList items={this.props.items}/>
            <div className="export-button">
              <button className="ui icon button" onClick={this.export}>
                <i className="ui share alternate square icon"/>
                Export
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ShoppingList.propTypes = {
  items: PropTypes.array
}

ShoppingList.defaultProps = {
  items: []
}

export default ShoppingList;
