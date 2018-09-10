import React from 'react';
import ReactDOM from 'react-dom';
import { withRouter } from 'react-router-dom'

import { withKitchen } from 'state/KitchenState';

import CategorySearchDropdown from 'components/common/category-search-dropdown.react';

import _values from 'lodash/values';
import _kebabCase from 'lodash/kebabCase';
import _isEmpty from 'lodash/isEmpty';
import _isEqual from 'lodash/isEqual';
import _isString from 'lodash/isString';

class SearchItemsByNameDropdown extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: ''
    }
  }

  navigateToItem = (result, response) => {
    this.props.history.push(`/kitchen/item/${result.title}`);
  }

  render() {
    return (
      <div className="search-items-by-name-dropdown-wrapper">
        <CategorySearchDropdown placeholder="Search kitchen items..."
                                loading={ _isEmpty(this.props.kitchenIndex) }
                                items={ _values(this.props.kitchenIndex).map((item) => {
                                  return {
                                    category: item.category || 'Unknown',
                                    title: item.description
                                  };
                                }) }
                                onSelect={ this.navigateToItem }/>
      </div>
    );
  }
}

export default withRouter(withKitchen(SearchItemsByNameDropdown));
