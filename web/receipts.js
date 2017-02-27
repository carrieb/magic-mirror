import React from 'react';
import { render } from 'react-dom';
import { Router, Route, Link, browserHistory, IndexRedirect } from 'react-router'

import ReactCrop from 'react-image-crop';

import ApiWrapper from 'util/api-wrapper';

const Cropper = React.createClass({
  // propTypes: {
  //   imageUrl: React.PropTypes.string.isRequired
  // },

  componentWillMount() {
    console.log(this.props.params.filename);
  },

  getInitialState() {
    return {
      crop: null
    };
  },

  handleCropChange(crop, pixelCrop) {
    console.log(pixelCrop);
    this.setState({ crop: pixelCrop });
  },

  submitCrop() {
    // TODO: $.ajax('/crop/imageUrl', { data: crop });
    if (this.state.crop != null) {
      ApiWrapper.submitCrop(this.props.params.filename, this.state.crop, this.complete);
    }
  },

  complete() {
    console.log('done, trasition to verify?');
    // TODO: transition to verify
    this.props.router.push(`/process-receipt/verify/${this.props.params.filename}`);
  },

  render() {
    return (
      <div className="editor-wrapper">
        <ReactCrop src={`/images/${this.props.params.filename}`} onComplete={this.handleCropChange}/>
        <input type="submit" className="ui fluid primary button" onClick={this.submitCrop}/>
      </div>
    );
  }
});

const Uploader = React.createClass({
  readImage(ev) {
    console.log(ev.target.files);
    // View image in 'image-result'
    // if (ev.target.files && ev.target.files[0]) {
    //     var reader = new FileReader();
    //     reader.onload = function (e) {
    //         const image = document.getElementById('image-result');
    //         image.setAttribute('src', e.target.result);
    //         image.setAttribute('width', 400);
    //         image.setAttribute('height', 650);
    //     };
    //     reader.readAsDataURL(ev.target.files[0]);
    // }

    // TODO: load in cropper with URL after submit
  },

  render() {
    return (
      <div className="text-center uploader-wrapper">
        <h2>Directions:</h2>
        <h3>Turn on flash, take picture of only food items on receipt on white background.</h3>
        <form method="post" action="/receipt" encType="multipart/form-data" onSubmit={this.handleSubmit}>
          <label htmlFor="receipt" className="ui fluid button">Upload Receipt</label>
          <input className="hidden-file-input" id="receipt" name="receipt" type="file" accept="image/*" capture="camera" onChange={this.readImage}/>
          <input type="submit" className="ui fluid primary button"/>
        </form>
        <img id="image-result"/>
      </div>
    );
  }
});

const Verifier = React.createClass({
  componentWillMount() {
    ApiWrapper.extractText(this.props.params.filename, (items) => {
      this.setState({ items });
    });
  },

  getInitialState() {
    return {
      items: []
    };
  },

  submitItems() {
    // TODO: .. upload these to my db .. 
  },

  render() {
    const itemInputs = this.state.items.map((item, index) => {
      return (
        <div className="two fields" key={index}>
          <div className="twelve wide field">
            <input type="text" defaultValue={item.description}/>
          </div>
          <div className="four wide field">
            <div className="ui left labeled input">
              <div className="ui label">$</div>
              <input type="text" defaultValue={item.price}/>
            </div>
          </div>
        </div>
      );
    });
    return (
      <div className="verifier-wrapper">
        <div className="ui grid">
          <div className="eight wide column">
            <img src={`/processed-images/${this.props.params.filename}`}/>
          </div>
          <div className="eight wide column">
            <form className="ui form">
              { itemInputs }
              <input type="submit" className="ui right floated primary button" onClick={this.submitItems}/>
            </form>
          </div>
        </div>
      </div>
    );
  }
});

// TODO: add react router: receipt/upload receipt/crop receipt/verify
// TODO: add semantic-ui and "steps"

const ReceiptProcessor = React.createClass({
  render() {
    const lastRoute = this.props.routes[this.props.routes.length-1];
    console.log(lastRoute);
    return (
      <div className="ui container receipt-processor-container">
        <div className="ui tiny fluid steps">
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
        { this.props.children }
      </div>
    );
  }
});


window.onload = function() {
  render(
    <Router history={browserHistory}>
      <Route path="/process-receipt" component={ReceiptProcessor}>
        <IndexRedirect to="upload"/>
        <Route path="upload" component={Uploader}/>
        <Route path="crop/:filename" component={Cropper}/>
        <Route path="verify/:filename" component={Verifier}/>
      </Route>
    </Router>,
    document.getElementById("render-wrapper")
  );
}
