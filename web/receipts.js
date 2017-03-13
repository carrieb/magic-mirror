import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, browserHistory, IndexRedirect } from 'react-router'

import ItemInputs from 'components/receipts/item-inputs';
import Cropper from 'components/receipts/cropper';
import Uploader from 'components/receipts/uploader';

import ApiWrapper from 'util/api-wrapper';

const Verifier = React.createClass({
  componentWillMount() {
    ApiWrapper.extractText(this.props.params.filename, (items) => {
      this.setState({ items, loaded: true });
    }, () => {
      this.setState({ error: true });
    });
  },

  getInitialState() {
    return {
      items: [],
      loaded: false,
      submitted: false,
      collapsed: true,
      error: false
    };
  },

  submitItems(ev) {
    // TODO: .. upload these to my db ..
    console.log(this.state.items);
    ApiWrapper.submitItems(this.state.items, () => { this.setState({ submitted: true }); });
    ev.preventDefault();
  },

  toggleCollapsed() {
    this.setState({ collapsed: !this.state.collapsed });
  },

  render() {
    let itemInputs = [];
    this.state.items.forEach((item, index) => {
      const updateAtIndex = (field) => {
        return (ev) => {
          console.log(ev.target.value);
          this.state.items[index][field] = ev.target.value;
          //console.log(this.state.items);
          this.setState({ items: this.state.items });
        }
      };
      let extraContent;
      if (!this.state.collapsed) {
        extraContent = 'Extra content';
      }
      itemInputs.push(
        <ItemInputs key={index} item={item} onChange={updateAtIndex}/>
      );
      if (index !== this.state.items.length - 1) {
        itemInputs.push(<div key={`divider-${index}`} className="ui hidden divider"></div>)
      }
    });
    let content;
    if (this.state.error) {
      content = (<div>error</div>);
    } else {
      content = (
        <div>
          <img className="ui bordered image" src={`/processed-images/${this.props.params.filename}`}/>
          <form className="ui form">
            { itemInputs }
            <button type="submit"
              className={`ui massive fluid primary toggle button ${this.state.submitted ? 'active disabled' : ''}`}
              onClick={this.submitItems}>
              {this.state.submitted ? <span><i className="checkmark icon"></i>Success</span> : 'Submit'}
            </button>
          </form>
        </div>
      );
    }
    return (
      <div className="verifier-wrapper">
        { content }
      </div>
    );
  }
});

// TODO: add react router: receipt/upload receipt/crop receipt/verify
// TODO: add semantic-ui and "steps"

const ReceiptProcessor = React.createClass({
  render() {
    const lastRoute = this.props.routes[this.props.routes.length-1];
    console.log(lastRoute);
    const steps = (
      <div className="ui veritcal fluid mini steps">
        <div className={`${lastRoute.path.startsWith('upload') ? 'active' : '' } step`}>
          <i className="photo icon"></i>
          <div className="content">
            <div className="title">Upload Photo</div>
            <div className="description">Take a picture of your receipt</div>
          </div>
        </div>
        <div className={`${lastRoute.path.startsWith('crop') ? 'active' : '' } step`}>
          <i className="crop icon"></i>
          <div className="content">
            <div className="title">Crop</div>
            <div className="description">Crop out only item text</div>
          </div>
        </div>
        <div className={`${lastRoute.path.startsWith('verify') ? 'active' : '' } step`}>
          <i className="align left icon"></i>
          <div className="content">
            <div className="title">Extract</div>
            <div className="description">Verify extracted text</div>
          </div>
        </div>
      </div>
    );
    return (
      <div className="ui container receipt-processor-container">
        { this.props.children }
        { steps }
      </div>
    );
  }
});


window.onload = function() {
  ReactDOM.render(
    <Router history={browserHistory}>
      <Route path="/process-receipt" component={ReceiptProcessor}>
        <IndexRedirect to="upload"/>
        <Route path="upload" component={Uploader}/>
        <Route path="crop/:filename" component={Cropper}/>
        <Route path="verify/:filename" component={Verifier}/>
      </Route>
    </Router>,
    document.getElementById("render-wrapper")
  );
}
