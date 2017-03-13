import React from 'react';

import ApiWrapper from 'util/api-wrapper';

import CropperJs from 'cropperjs';

const Cropper = React.createClass({
  // propTypes: {
  //   imageUrl: React.PropTypes.string.isRequired
  // },

  componentWillMount() {
    console.log(this.props.params.filename);
  },

  getInitialState() {
    return {
      crop: null,
      ready: false
    };
  },

  handleCropChange(crop, pixelCrop) {
    console.log(pixelCrop);
    this.setState({ crop: pixelCrop });
  },

  submitCrop() {
    // TODO: $.ajax('/crop/imageUrl', { data: crop });
    if (this.state.crop != null) {
      this.setState({
        uploading: true
      });
      ApiWrapper.submitCrop(this.props.params.filename, this.state.crop, this.complete);
    }
  },

  complete() {
    console.log('done, trasition to verify?');
    // TODO: transition to verify
    this.props.router.push(`/process-receipt/verify/${this.props.params.filename}`);
  },

  handleImageRef(ref) {
    this.image = ref;
  },

  componentDidMount() {
    console.log(this.image);
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
        //console.log(e.detail);
      },
      ready: () => {
        this.setState({
          ready: true
        });
      }
    });
  },

  render() {
    const url = `/images/${this.props.params.filename}`;
    console.log(this.crop)
    return (
      <div className="cropper-wrapper">
        <div className="image-editor">
          <div className={`ui ${this.state.ready ? '' : 'active'} text loader`}>Preparing Image..</div>
          <img style={{display: this.state.ready ? 'none' : 'block'}}src={url} ref={this.handleImageRef}/>
        </div>
        <button className={`ui huge fluid primary toggle ${this.state.crop === null ? 'disabled' : '' } ${this.state.uploading ? 'active loading' : ''}  button`}
                onClick={this.submitCrop}>Submit</button>
      </div>
    );
  }
});

export default Cropper;
