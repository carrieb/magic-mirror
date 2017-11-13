import React from 'react';
import ReactDOM from 'react-dom';
import { withRouter, Router, Route, Redirect } from 'react-router'
import { Link, NavLink } from 'react-router-dom';

import createHistory from 'history/createBrowserHistory';

const history = createHistory();

import Cropper from 'components/receipts/cropper.react';
import Uploader from 'components/receipts/uploader.react';
import Verifier from 'components/receipts/verifier.react';

import ApiWrapper from 'util/api-wrapper';

import 'styles/receipts/receipts-processor.css';

// TODO: add react router: receipt/upload receipt/crop receipt/verify
// TODO: add semantic-ui and "steps"

import 'sass/receipts/receipts.scss';

const NavItem = ({children, to, exact}) => {
    return (
        <Route path={to} exact={exact} children={({match}) => (
            <div className={`${match && 'active'} step`}>
                {children}
            </div>
        )}/>
    );
}

class ProcessorNavigation extends React.Component {
  render() {
    return (
      <div className="ui vertical fluid mini steps processor-nav">
        <NavItem to="/process-receipt/upload" exact={true}>
          <i className="photo icon"></i>
          <div className="content">
            <div className="title">Upload Photo</div>
            <div className="description">Take a picture of your receipt</div>
          </div>
        </NavItem>
        <NavItem to="/process-receipt/crop">
          <i className="crop icon"></i>
          <div className="content">
            <div className="title">Crop</div>
            <div className="description">Crop out only item text</div>
          </div>
        </NavItem>
        <NavItem to="/process-receipt/verify">
          <i className="align left icon"></i>
          <div className="content">
            <div className="title">Extract</div>
            <div className="description">Verify extracted text</div>
          </div>
        </NavItem>
      </div>
    )
  }
}

const ProcessorNavigationWithRouter = withRouter(ProcessorNavigation);

window.onload = function() {
  ReactDOM.render(
    <Router history={history}>
      <div className="ui container receipt-processor">
        <Route path="/process-receipt" exact={true} render={() => <Redirect to="/process-receipt/upload"/>}/>
        <Route path="/process-receipt/upload" exact={true} component={Uploader}/>
        <Route path="/process-receipt/crop/:filename" component={Cropper}/>
        <Route path="/process-receipt/verify/:filename" component={Verifier}/>
        <ProcessorNavigationWithRouter/>
      </div>
    </Router>,
    document.getElementById("render-wrapper")
  );
}
