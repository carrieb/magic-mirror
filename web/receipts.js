import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, browserHistory, IndexRedirect } from 'react-router'

import ItemInputs from 'components/receipts/item-inputs';
import Cropper from 'components/receipts/cropper';
import Uploader from 'components/receipts/uploader';
import Verifier from 'components/receipts/verifier';

import ApiWrapper from 'util/api-wrapper';

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
        <Route path="verify" component={Verifier}/>
        <Route path="verify/:filename" component={Verifier}/>
      </Route>
    </Router>,
    document.getElementById("render-wrapper")
  );
}
