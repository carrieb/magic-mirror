import React from 'react';
import PropTypes from 'prop-types';

import ExpirationFormField from 'components/kitchen/item/form/ExpirationFormField.react';
import ServingSizeFormField from 'components/kitchen/item/form/ServingSizeFormField.react';
import QuantityFormField from 'components/kitchen/item/form/QuantityFormField.react';

class ItemInputs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: true
    };
  }

  toggleCollapsed(ev) {
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

  onExpirationChange(expiration) {
    console.log(expiration);
    // TODO:
  }

  render() {
    const item = this.props.item;
    let extraContent;
    if (!this.state.collapsed) {
      extraContent = (
        <div className="ui grid" style={{ marginBottom: '15px' }}>
          <div className="five wide column"><h5>Expiration</h5></div>
          <ExpirationFormField className="eleven wide column" onChange={this.onExpirationChange}/>
          <div className="five wide column"><h5>Serving Size</h5></div>
          <ServingSizeFormField className="eleven wide column" onChange={this.onServingSizeChange}/>
          <div className="five wide column"><h5>Quantity</h5></div>
          <QuantityFormField className="eleven wide column" onChange={this.onQuantityChange}/>
        </div>
      );
    }
    return (
      <div className="item-inputs-wrapper">
        <div className="two fields">
          <div className="twelve wide field">
            <input type="text" value={item.description} onChange={this.props.onChange('description')}/>
          </div>
          <div className="four wide field">
            <div className="ui left labeled input right-aligned">
              <div className="ui label">$</div>
              <input className="right-aligned" type="number" value={item.price} onChange={this.props.onChange('price')}/>
              <button className="ui basic right floated icon button" onClick={this.toggleCollapsed}>
                <i className={`chevron ${this.state.collapsed ? 'up' : 'down'} icon`}></i>
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
