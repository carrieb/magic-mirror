import React from 'react';
import PropTypes from 'prop-types';

import _noop from 'lodash/noop';

class TagsInput extends React.Component {
  componentDidMount() {
    $(this.dropdown).dropdown({
      allowAdditions: true,
      values: this.props.values.map((val) => {
        return {
          name: val,
          value: val,
          selected: true
        };
      }),
      onChange: this.onChange
    });
  }

  handleRef = (ref) => {
    this.dropdown = ref;
  }

  onChange = (value) => {
    if (value === "") {
      this.props.onChange([]);
    } else {
      const split = value.split(',');
      this.props.onChange(split);
    }
  }

  render() {
    return (
      <div className="field">
        <label>Tags</label>
        <div className="ui fluid multiple search selection dropdown" ref={this.handleRef}>
           <input name="tags" type="hidden"/>
           <div className="default text">Tags</div>
        </div>
      </div>
    );
  }
}

TagsInput.propTypes = {
  onChange: PropTypes.function,
  values: PropTypes.arrayOf(PropTypes.string)
}

TagsInput.defaultProps = {
  onChange: _noop,
  values: []
}

export default TagsInput;
