import React from 'react';
import ReactDOM from 'react-dom';

import QuantityFormField from 'components/kitchen/item/form/QuantityFormField.react';

import ApiWrapper from 'util/api-wrapper';

import 'sass/kitchen/eat-modal.scss';

class EatModal extends React.Component  {
  constructor(props) {
    super(props);

    this.state = {
      eatenPercentage: 0,
      eatenQuantity: null,
      useSlider: true
    }
  }

  componentDidMount() {
    $('.modal').modal('show');
  }

  onSubmit = () => {
    ApiWrapper.eatFood({
      id: this.props._id,
      percent: this.state.eatenPercentage
    })
  }

  updateEatenPercentage = (ev) => {
    this.setState({ eatenPercentage: ev.target.value });
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
          <div className="ui positive right labeled icon button">
            Save
            <i className="utensils icon"/>
          </div>
        </div>
      </div>
    );
  }
}

export default EatModal;
