import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';

import moment from 'moment';

import MessagingUtil from 'util/messaging-util';
import ApiWrapper from 'util/api-wrapper';

const Kitchen = React.createClass({
  getInitialState() {
    return {
      kitchen: []
    }
  },

  componentWillMount() {
    MessagingUtil.subscribeDevice();
    ApiWrapper.getKitchen((kitchen) => this.setState({ kitchen }));
  },

  onSettingsClick(idx) {
    return (idx) => {
      // TODO: display settings for that item..
    };
  },

  render() {
    const lastRoute = this.props.routes[this.props.routes.length-1];
    //console.log(lastRoute);

    const itemCards = this.state.kitchen.map((foodItem, idx) => {
      const lastImport = moment(foodItem.importDates[foodItem.importDates.length - 1], "MM/DD/YYYY")
      return (
        <div className="ui card" key={idx}>
          <div className="content">
            <i className="grey right floated link settings icon" onClick={this.onSettingsClick(idx)}></i>
            <div className="header">{foodItem.description}</div>
            <div className="meta">
              <a>Fridge</a>
            </div>
          </div>
          <div className="extra content">
            <span>
              <i className="cube icon"></i>
              {foodItem.quantity}
            </span>
            <span className="right floated">
              { `${lastImport.toNow(true)} old` }
            </span>
          </div>
        </div>
      );
    });

    return (
      <div className="ui container kitchen-container">
        <div className="ui secondary menu">
          <div className="header active item">
            Kitchen
          </div>
          <a className="right floated item" href="/process-receipt">
            <i className="upload icon"></i>
            Upload
          </a>
        </div>
        { this.props.children }
        <div className="ui six doubling cards kitchen-inventory">
          { itemCards }
        </div>
      </div>
    );
  }
});


window.onload = function() {
  ReactDOM.render(
    <Router history={browserHistory}>
      <Route path="/kitchen" component={Kitchen}>
      </Route>
    </Router>,
    document.getElementById("render-wrapper")
  );
}
