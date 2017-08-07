import React from 'react';

import ApiWrapper from '../util/api-wrapper';

class Wanikani extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null,
      studyQueue: null,
      recentUnlock: null,
      loaded: false
    };
  }

  componentWillMount() {
    ApiWrapper.getWanikaniData((res) => {
      this.setState({
        user: res.user_information,
        studyQueue: res.study_queue,
        recentUnlock: res.recent_unlock,
        loaded: true
      });
    });
  }

  render() {
    let level;
    if (this.state.loaded) {
      const unlock = this.state.recentUnlock;
      const reading = unlock.kana ? unlock.kana : (unlock.kunyomi + ' | ' + unlock.onyomi)
      level = (
        <div className="content">
          <div className="status" style={{ overflow: 'auto' }}>
            <div className="in-circle pull-left level">{this.state.user.level}</div>
            <div>
              <span>Lessons: {this.state.studyQueue.lessons_available}</span><br/>
              <span>Reviews: {this.state.studyQueue.reviews_available}</span>
            </div>
          </div>
          <div className="recent-unlock text-center">
            <div className="character">{ unlock.character }</div>
            <div className="description">{ unlock.meaning }</div>
            <div className="kana">{ reading }</div>
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
}

export default Wanikani;
