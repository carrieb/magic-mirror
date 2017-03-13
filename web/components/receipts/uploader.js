import React from 'react';

import ApiWrapper from 'util/api-wrapper';

const Uploader = React.createClass({
  getInitialState() {
    return {
      uploading: false,
      selected: false
    };
  },

  readImage(ev) {
    console.log(ev.target.files);
    // View image in 'image-result'
    if (ev.target.files && ev.target.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            const image = document.getElementById('image-result');
            image.setAttribute('src', e.target.result);
            image.style.display = 'block';
        };
        reader.readAsDataURL(ev.target.files[0]);
    }
    this.setState({
      selected: true
    });
  },

  submit() {
    $(this.form).submit();
  },

  handleSubmit() {
    this.setState({
      uploading: true
    });
  },

  handleFormRef(ref) {
    this.from = ref;
  },

  render() {
    let image;

    return (
      <div className="text-center uploader-wrapper">
        <div className="ui icon info message">
          <i className="photo icon"></i>
          <div className="content">
            <div className="header">DIRECTIONS</div>
            <p>Turn on flash, take picture of only food items on receipt on white background.</p>
          </div>
        </div>
        <form method="post" action="/receipt" encType="multipart/form-data" onSubmit={this.handleSubmit} ref={this.handleFormRef}>
          <label htmlFor="receipt" className="ui huge fluid button">Upload Receipt</label>
          <input className="hidden-file-input" id="receipt" name="receipt" type="file" accept="image/*" capture="camera" onChange={this.readImage}/>
          <img className="ui rounded image" id="image-result"/>
          <button className={`ui huge fluid toggle primary ${this.state.selected ? '' : 'disabled'} ${this.state.uploading ? 'active loading' : ''} button`} onClick={this.submit}>Submit</button>
        </form>
      </div>
    );
  }
});

export default Uploader;
