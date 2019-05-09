import React from 'react';

import { withKitchen } from 'state/KitchenState';

import { withRouter } from 'react-router';

class AddModal extends React.Component {
  state = {
    name: ''
  }

  componentDidMount() {
    console.log('hey');
    $('.add-modal')
      .modal({ detachable: false, transition: 'horizontal flip', onHidden: this.props.onCancel })
      .modal('show');
  }

  onSubmit = () => {
    // TODO: make call to create new item with just name
    // navigate browser to it's editing page
    // show warning and prevent submit if name already exists
    const name = this.state.name;
    const newItem = { name };
    this.props.newUpdateItem(newItem)
      .done(() => { this.props.history.push(`/kitchen/item/${name}`) });
  }

  render() {
    return <div className="ui mini modal add-modal">
      <div className="header">Name of New Item</div>
      <div className="content">
        <div className="ui form">
          <div className="fluid field">
            <input type="text" value={this.state.name} onChange={ (ev) => this.setState({ name: ev.target.value }) }
                   onKeyDown={ (e) => { if (e.key === 'Enter') { $('.add-modal').modal('hide'); this.onSubmit(); } } }/>
          </div>
        </div>
      </div>
      <div className="actions">
        <div className="ui red deny button">
          Cancel
        </div>
        <div className="ui positive right labeled icon button" onClick={this.onSubmit}>
          Save
          <i className="utensils icon"/>
        </div>
      </div>
    </div>;
  }
}

export default withRouter(withKitchen(AddModal));
