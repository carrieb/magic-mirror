import React from 'react';
import ReactDOM from 'react-dom';

import QuantityFormField from 'components/kitchen/item/form/QuantityFormField.react';

import { convertToQty } from 'src/common/quantities';

import ApiWrapper from 'util/api-wrapper';

import { withKitchen } from 'state/KitchenState';

import 'sass/kitchen/eat-modal.scss';

let modal = null;
let callbacks = [];

class EatModal extends React.Component  {
  constructor(props) {
    super(props);

    this.state = {
      eatenPercentage: 0,
      eatenQuantity: null,
      useSlider: true
    }
  }

  onSubmit = () => {
    const { eatenPercentage, eatenQuantity } = this.state;
    this.props.onSubmit(eatenPercentage, eatenQuantity);
  }

  updateEatenPercentage = (ev) => {
    this.setState({ eatenPercentage: ev.target.value });
  }

  setEatenPercentage(eatenPercentage) {
    return () => { this.setState({ eatenPercentage }) };
  }

  updateEatenQuantity = (eatenQuantity) => {
    this.setState({ eatenQuantity });
  }

  toggleMode = () => {
    this.setState({ useSlider: !this.state.useSlider });
  }

  render() {
    const slider = (
      <div className="content">
        <div className="ui basic fluid buttons">
          <button className="ui button" onClick={this.setEatenPercentage(50)}>Half</button>
          <button className="ui button" onClick={this.setEatenPercentage(100)}>All</button>
        </div>
        <span style={{ float: 'right' }}>{this.state.eatenPercentage}%</span>
        <input type="range" value={this.state.eatenPercentage}
                            onChange={this.updateEatenPercentage} max="100" step="1" min="0"/>
        <div className="centered">
          <button className="ui basic centered labeled icon button" onClick={this.toggleMode}>
            <i className="undo alternate icon"/>
            Enter Raw Amount
          </button>
        </div>
      </div>
    );

    const amount = (
      <div className="content">
        <QuantityFormField quantity={this.state.eatenQuantity} onChange={this.updateEatenQuantity}/>
        <div className="centered">
          <button className="ui basic labeled icon button" onClick={this.toggleMode}>
            <i className="undo alternate icon"/>
            Enter Percentage
          </button>
        </div>
      </div>
    )
    return (
      <div className="ui mini modal eat-modal">
        <div className="header">How much did you eat?</div>
        { this.state.useSlider && slider }
        { !this.state.useSlider && amount }
        <div className="actions">
          <div className="ui red deny button">
            Cancel
          </div>
          <div className="ui positive right labeled icon button" onClick={this.onSubmit}>
            Save
            <i className="utensils icon"/>
          </div>
        </div>
      </div>
    );
  }
}

function onModalSubmit(eatenPercentage, eatenQuantity) {
  const next = callbacks.pop();
  if (next) {
    //console.log(next, eatenPercentage, eatenQuantity);
    next(eatenPercentage, eatenQuantity);
  }
}

// TODO: some piece of code that creates a new <modals div> and mounts an eat modal as a child??
function showEatModal(callback) {
  //console.log(callback);
  if (modal === null) {
    const modalsContainer = document.getElementById('modals');
    const eatModalDiv = document.createElement('div');
    modalsContainer.appendChild(eatModalDiv);
    modal = <EatModal onSubmit={onModalSubmit}/>;
    ReactDOM.render(modal, eatModalDiv);
  }

  callbacks.push(callback);

  $('.eat-modal').modal({ detachable: false, transition: 'horizontal flip' })
    .modal('show');
}

const EatModalExport = { EatModal: withKitchen(EatModal), showEatModal }

module.exports = EatModalExport;
