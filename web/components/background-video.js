import React from 'react';
import ReactDOM from 'react-dom';

import 'styles/component/background-video.css';

class BackgroundVideo extends React.Component {
  handleVideoRef(ref) {
    const node = ReactDOM.findDOMNode(ref);

    navigator.mediaDevices.getUserMedia({
      video: true
    }).then((stream) => {
      node.srcObject = stream;
    }).catch((error) => {
      console.log(error);
    });
  }

  render() {
    return (
      <div className="background-video">
        <video className="video" autoPlay="true" ref={this.handleVideoRef}>
        </video>
      </div>
    )
  }
}

export default BackgroundVideo;
