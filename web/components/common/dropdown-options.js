import React from 'react';

const DropdownOptions = React.createClass({
  propTypes: {
    options: React.PropTypes.array.isRequired,
  },

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
});

export default DropdownOptions;
