import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import _values from 'lodash/values';
import _kebabCase from 'lodash/kebabCase';
import _isEmpty from 'lodash/isEmpty';
import _isEqual from 'lodash/isEqual';
import _isString from 'lodash/isString';

class CategorySearchDropdown extends React.Component {
  componentDidMount() {
    this.refresh();
  }

  componentDidUpdate(prevProps) {
    if (!_isEqual(this.props.items, prevProps.items) || this.props.loading != prevProps.loading) {
      this.refresh();
    }
  }

  refresh = () => {
    $(this.search).search({
      type: 'category',
      searchField: 'title',
      source: this.props.items,
      onSelect: this.props.onSelect
    });
  }

  render() {
    return (
      <div className={`ui fluid ${this.props.loading ? 'loading' : '' } search`}
           ref={(ref) => this.search = ref}>
        <div className="ui fluid icon input">
          <input className="prompt" type="text" placeholder={this.props.placeholder}/>
          <i className="search icon"></i>
        </div>
        <div className="results"></div>
      </div>
    );
  }
}

CategorySearchDropdown.propTypes = {
  loading: PropTypes.bool,
  placeholder: PropTypes.string,
  items: PropTypes.array,
  onSelect: PropTypes.func
}

export default CategorySearchDropdown;
