import React from 'react';
import PropTypes from 'prop-types';

import ExpirationFormField from 'components/kitchen/item/form/ExpirationFormField.react';
import ServingSizeFormField from 'components/kitchen/item/form/ServingSizeFormField.react';
import QuantityFormField from 'components/kitchen/item/form/QuantityFormField.react';

import ControlledItemEditor from 'components/kitchen/controlled-item-editor.react';

class ItemInputs extends React.Component {
  state = {
    collapsed: true
  }

  toggleCollapsed = (ev) => {
    this.setState({
      collapsed: !this.state.collapsed
    });
    ev.preventDefault();
  }

  componentDidUpdate() {
    if (!this.state.collapsed) {
      $(this.dropdown).dropdown();
    }
  }

  render() {
    const item = this.props.item;
    let extraContent;
    if (!this.state.collapsed) {
      extraContent = (
        <ControlledItemEditor foodItem={item} onChange={this.props.onChange}/>
      );
    }
    return (
      <div className="item-inputs-wrapper">
        <div className="two unstackable fields">
          <div className="nine wide field">
            <input type="text" value={item.description} onChange={(ev) => this.props.onChange('description', ev.target.value)}/>
          </div>
          <div className="seven wide field">
            <div className="ui left labeled input right-aligned">
              <div className="ui label">$</div>
              <input type="number"
                       value={item.price} 
                     onChange={(ev) => this.props.onChange('price', ev.target.value)}/>
              <button className="ui basic right floated icon button" onClick={this.toggleCollapsed}>
                <i className={`chevron ${this.state.collapsed ? 'up' : 'down'} icon`}></i>
              </button>
              <button className="ui basic right floated icon button" onClick={this.props.onDelete}>
                <i className="trash icon"></i>
              </button>
            </div>
          </div>
        </div>
        { extraContent }
      </div>
    );
  }
}

ItemInputs.propTypes = {
  item: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
};

export default ItemInputs;
