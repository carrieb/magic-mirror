import React from 'react';
import { withRouter } from 'react-router';

import ApiWrapper from 'util/api-wrapper';

import CropperJs from 'cropperjs';

class Cropper extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      crop: null,
      ready: false,
      filename: this.props.match.params.filename
    };
  }

  handleImageRef = (ref) => {
    this.image = ref;
  }

  componentDidMount() {
    console.log(this.image, this.image.offsetWidth, this.image.offsetHeight);
    const cropper = new CropperJs(this.image, {
      rotateable: false,
      cropBoxMoveable: false,
      crop: (e) => {
        this.setState({
          crop: {
            x: Math.floor(e.detail.x),
            y: Math.floor(e.detail.y),
            width: Math.floor(e.detail.width),
            height: Math.floor(e.detail.height),
            rotate: e.detail.rotate
          }
        });
      },
      ready: () => {
        this.setState({
          ready: true
        });
      }
    });
  }

  handleCropChange = (crop, pixelCrop) => {
    this.setState({ crop: pixelCrop });
  }

  submitCrop = () => {
    if (this.state.crop != null) {
      this.setState({
        uploading: true
      });

      ApiWrapper.submitCrop(this.state.filename, this.state.crop, this.complete);
    }
  }

  complete = () => {
    this.props.history.push(`/process-receipt/verify/${this.state.filename}`);
  }

  render() {
    const url = `/images/${this.state.filename}`;
    // console.log(this.state.crop)
    return (
      <div className="cropper-wrapper">
        <div className="image-editor">
          <div className={`ui ${this.state.ready ? '' : 'active'} text loader`}>
            Preparing Image..
          </div>
          <img style={{display: this.state.ready ? 'none' : 'block'}}
               src={url}
               ref={this.handleImageRef}/>
        </div>
        <button className={`ui huge fluid primary toggle ${this.state.crop === null ? 'disabled' : '' } ${this.state.uploading ? 'active loading' : ''}  button`}
                onClick={this.submitCrop}>Submit</button>
      </div>
    );
  }
}

export default withRouter(Cropper);
