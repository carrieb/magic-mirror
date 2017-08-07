import React from 'react';
import PropTypes from 'prop-types';

class IngredientsInputs extends React.Component {
  handleChange(ev, field) {
    if (this.props.onChange) {
      console.log(field, ev.target.value);
      this.props.onChange(field, ev.target.value)
    }
  }

  render() {
    return <div className="ingredients-fields">
      <div className="ui field">
        <label>Name</label>
        <div className="ui transparent input">
          <input type="text" onChange={(ev) => this.handleChange(ev, 'name')}/>
        </div>
      </div>

      <div className="ui field">
        <label>Quantity</label>
        <div className="ui transparent input">
          <input type="text" onChange={(ev) => this.handleChange(ev, 'quantity')}/>
        </div>
      </div>
    </div>;
  }
}

IngredientsInputs.propTypes = {
  index: PropTypes.number.isRequired,
  onChange: PropTypes.func
}

export default IngredientsInputs;
