import React from 'react';

const ItemInputs = React.createClass({
  propTypes: {
    item: React.PropTypes.object.isRequired,
    onChange: React.PropTypes.func.isRequired
  },

  getInitialState() {
    return {
      collapsed: true
    };
  },

  toggleCollapsed(ev) {
    this.setState({
      collapsed: !this.state.collapsed
    });
    ev.preventDefault();
  },

  handleDropdownRef(ref) {
    this.dropdown = ref;
  },

  componentDidUpdate() {
    if (!this.state.collapsed) {
      $(this.dropdown).dropdown();
    }
  },

  render() {
    const item = this.props.item;
    let extraContent;
    if (!this.state.collapsed) {
      extraContent = (
        <div className="ui grid">
          <div className="five wide column">
            <b>Expires in:</b>
          </div>
          <div className="eleven wide column">
            <input type="number" placeholder="3" style={{ marginBottom: '10px'}}/>
            <div className="ui fluid selection dropdown" ref={this.handleDropdownRef}>
              <input type="hidden" name="expirationDelta"/>
              <i className="dropdown icon"></i>
              <div className="default text">Weeks</div>
              <div className="menu">
                <div className="item" data-value="days">Days</div>
                <div className="item" data-value="weeks">Weeks</div>
                <div className="item" data-value="months">Months</div>
              </div>
            </div>
          </div>
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
});

export default ItemInputs;
