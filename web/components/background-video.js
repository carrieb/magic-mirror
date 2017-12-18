import React from 'react';
import ReactDOM from 'react-dom';

import 'styles/component/background-video.css';

class BackgroundVideo extends React.Component {
  handleVideoRef(ref) {
    const node = ReactDOM.findDOMNode(ref);
    // navigator.getUserMedia = navigator.getUserMedia ||
    //   navigator.webkitGetUserMedia ||
    //   navigator.mozGetUserMedia ||
    //   navigator.msGetUserMedia ||
    //   navigator.oGetUserMedia;
    // if (navigator.getUserMedia) {
    //   navigator.getUserMedia({video: true}, (stream) => {
    //     //node.src = window.URL.createObjectURL(stream);
    //   }, (error) => {
    //     console.log(error);
    //   });
    // }
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
