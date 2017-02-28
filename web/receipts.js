import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, browserHistory, IndexRedirect } from 'react-router'

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
      }
    });
  },

  render() {
    const url = `/images/${this.props.params.filename}`;
    console.log(this.crop)
    return (
      <div className="cropper-wrapper">
        <div className="image-editor"><img src={url} ref={this.handleImageRef}/></div>
        <input type="submit" className="ui fluid primary button" onClick={this.submitCrop}/>
      </div>
    );
  }
});

const Uploader = React.createClass({
  readImage(ev) {
    console.log(ev.target.files);
    // View image in 'image-result'
    if (ev.target.files && ev.target.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            const image = document.getElementById('image-result');
            image.setAttribute('src', e.target.result);
        };
        reader.readAsDataURL(ev.target.files[0]);
    }
  },

  render() {
    return (
      <div className="text-center uploader-wrapper">
        <h2>DIRECTIONS</h2>
        <h1>Turn on flash, take picture of only food items on receipt on white background.</h1>
        <form method="post" action="/receipt" encType="multipart/form-data" onSubmit={this.handleSubmit}>
          <div className="ui grid">
            <div className="eight wide column">
              <label htmlFor="receipt" className="ui huge fluid button">Upload Receipt</label>
              <input className="hidden-file-input" id="receipt" name="receipt" type="file" accept="image/*" capture="camera" onChange={this.readImage}/>
            </div>
            <div className="eight wide column">
              <input type="submit" className="ui huge fluid primary button"/>
            </div>
          </div>
        </form>
        <img id="image-result"/>
      </div>
    );
  }
});

const Verifier = React.createClass({
  componentWillMount() {
    ApiWrapper.extractText(this.props.params.filename, (items) => {
      this.setState({ items, loaded: true });
    });
  },

  getInitialState() {
    return {
      items: [],
      loaded: false,
      submitted: false
    };
  },

  submitItems(ev) {
    // TODO: .. upload these to my db ..
    console.log(this.state.items);
    ApiWrapper.submitItems(this.state.items, () => { this.setState({ submitted: true }); });
    ev.preventDefault();
  },

  render() {
    const itemInputs = this.state.items.map((item, index) => {
      const updateAtIndex = (field, index) => {
        return (ev) => {
          this.state.items[index][field] = ev.target.value;
          //console.log(this.state.items);
          this.setState({ items: this.state.items });
        }
      };
      return (
        <div className="two fields" key={index}>
          <div className="twelve wide field">
            <input type="text" value={item.description} onChange={updateAtIndex('description', index)}/>
          </div>
          <div className="four wide field">
            <div className="ui left labeled input">
              <div className="ui label">$</div>
              <input type="text" value={item.price} onChange={updateAtIndex('price', index)}/>
            </div>
          </div>
        </div>
      );
    });
    return (
      <div className="verifier-wrapper">
        <div className="ui grid">
          <div className="eight wide column">
            <img className="ui bordered image" src={`/processed-images/${this.props.params.filename}`}/>
          </div>
          <div className="eight wide column">
            <form className="ui form">
              { itemInputs }
              <button type="submit"
                className={`ui right floated primary toggle button ${this.state.submitted ? 'active disabled' : ''}`}
                onClick={this.submitItems}>
                {this.state.submitted ? <span><i className="checkmark icon"></i>Success</span> : 'Submit'}
              </button>
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
    const steps = (
      <div className="ui mini fluid steps">
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
    );
    return (
      <div className="ui container receipt-processor-container">
        { this.props.children }
        { steps }
      </div>
    );
  }
});


window.onload = function() {
  ReactDOM.render(
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
