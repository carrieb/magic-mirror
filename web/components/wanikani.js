import React from 'react';

import ApiWrapper from '../util/api-wrapper';

const Wanikani = React.createClass({
  getInitialState() {
    return {
      user: null,
      studyQueue: null,
      recentUnlock: null,
      loaded: false
    };
  },

  componentWillMount() {
    ApiWrapper.getWanikaniData((res) => {
      this.setState({
        user: res.user_information,
        studyQueue: res.study_queue,
        recentUnlock: res.recent_unlock,
        loaded: true
      });
    });
  },

  render() {
    let level;
    if (this.state.loaded) {
      level = (
        <div className="content">
          <span className="in-circle pull-left level">{this.state.user.level}</span>
          <span>Lessons: {this.state.studyQueue.lessons_available}</span><br/>
          <span>Reviews: {this.state.studyQueue.reviews_available}</span>
          <div className="recent-unlock text-center">
            <span className="character">{ this.state.recentUnlock.character }</span><br/>
            <span className="description">{ this.state.recentUnlock.meaning }</span><br/>
            <span className="kana">{this.state.recentUnlock.kana }</span>
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
