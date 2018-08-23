import React from 'react';
import ReactDOM from 'react-dom';
import { withRouter } from 'react-router-dom'

import { withKitchen } from 'state/KitchenState';

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

  componentDidMount() {
    this.loadSearch();
  }

  componentDidUpdate(prevProps) {
    if (!_isEqual(this.props.kitchenIndex, prevProps.kitchenIndex)) {
      this.loadSearch();
    }
  }

  loadSearch = () => {
    if (!_isEmpty(this.props.kitchenIndex)) {
      const categorySource = _values(this.props.kitchenIndex).map((item) => {
        return {
          category: item.category || 'Unknown',
          title: item.description
        }
      });

      $(this.search).search({
        type: 'category',
        searchField: 'title',
        source: categorySource,
        onSelect: (result, response) => {
          this.props.history.push(`/kitchen/item/${result.title}`);
        }
      });
    }
  }

  render() {
    return (
      <div className="search-items-by-name-dropdown-wrapper">
        <div className={`ui fluid ${_isEmpty(this.props.kitchenIndex) ? 'loading' : '' } search`}
             ref={(ref) => this.search = ref}>
          <div className="ui fluid icon input">
            <input className="prompt" type="text" placeholder="Search kitchen..."/>
            <i className="search icon"></i>
          </div>
          <div className="results"></div>
        </div>
      </div>
    );
  }
}

export default withRouter(withKitchen(SearchItemsByNameDropdown));
