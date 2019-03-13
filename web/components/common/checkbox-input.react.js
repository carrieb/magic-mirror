import React from 'react';
import PropTypes from 'prop-types';

const CheckboxInput = ({ toggle, checked, label }) => <div className="ui checkbox"
     onClick={toggle}>
  <input type="checkbox"
        tabIndex="0"
        className="hidden"
        defaultChecked={checked}/>
  <label>{ label }</label>
</div>;

export default CheckboxInput;
