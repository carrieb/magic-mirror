import React from 'react';

import ApiWrapper from '../util/api-wrapper';

const Wanikani = React.createClass({
  getInitialState() {
    return {
      user: null,
      studyQueue: null,
      loaded: false
    };
  },

  componentWillMount() {
    ApiWrapper.getWanikaniStudyQueue((res) => {
      this.setState({
        user: res.user_information,
        studyQueue: res.requested_information,
        loaded: true
      });
    })
  },

  render() {
    let level;
    if (this.state.loaded) {
      level = (
        <div className="row">
          <div className="col-xs-2 vertical-center">
            <span className="in-circle">{this.state.user.level}</span>
          </div>
          <div className="col-xs-10">
            <span>Lessons: {this.state.studyQueue.lessons_available}</span><br/>
            <span>Reviews: {this.state.studyQueue.reviews_available}</span>
          </div>
        </div>
      );
    }
    return (
      <div className="wanikani-container">
        <strong>WANIKANI</strong>
        { level }
      </div>
    );
  }
});

export default Wanikani;
