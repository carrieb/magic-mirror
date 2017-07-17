import React from 'react';
import PropTypes from 'prop-types';

class DropdownOptions extends React.Component {
  render() {
    let options = this.props.options.map((opt, idx) => {
      return (<div className="item" key={idx}>{opt}</div>);
    });
    return (
      <div className="menu">
        { options }
      </div>
    );
  }
}

DropdownOptions.propTypes = {
  options: PropTypes.array.isRequired
}

export default DropdownOptions;
