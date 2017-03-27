import React from 'react';

import ApiWrapper from '../../util/api-wrapper';
import KitchenState from '../../state/KitchenState';

import uniqueId from 'lodash/uniqueId';

const FoodEditorHandler = React.createClass({
  componentWillMount() {
    this.reloadItem();
  },

  componentDidUpdate() {
    $('.ui.dropdown').dropdown();
  },

  getInitialState() {
    return {
      foodItem: null,
      id: uniqueId()
    };
  },

  reloadItem() {
    const foodItem = KitchenState.findFood(this.props.params.foodName, (foodItem) => {
      this.setState({ foodItem });
    });
  },

  handleDimmerRef(ref) {
    this.dimmer = ref;
    if (this.dimmer) {
      $(this.dimmer).dimmer({ on: 'hover' });
    }
  },

  handleFormRef(ref) {
    this.form = ref;
  },

  updateImage(ev) {
    // Must do ajax submit so page doesn't refresh.
    // TODO: upload image asynchronoustly
    // http://stackoverflow.com/questions/166221/how-can-i-upload-files-asynchronously
    // display loading spinner til done, then set the image url
    if (ev.target.files && ev.target.files[0]) {
      ApiWrapper.uploadFoodImage(this.form, (loaded, total) => {
        console.log(loaded, total);
      }).done((filename) => {
        console.log('done', filename);
        KitchenState.updateImage(this.props.params.foodName, filename);
        this.reloadItem();
      }).fail(() => {
        console.error('failed');
      });
    }
  },

  render() {
    const foodItem = this.state.foodItem;
    let content = null;
    let header = null;
    let image = null;
    if (foodItem) {
      header = (<h4 className="ui horizontal divider header"><i className="food icon"></i>{foodItem.description}</h4>);
      let imageUrl = foodItem.img ? `/food-images/${foodItem.img}` : '/food-images/no-image.png';
      image = (
        <div className="blurring dimmable image" ref={this.handleDimmerRef}>
          <div className="ui inverted dimmer">
            <div className="content">
              <div className="center">
                <form encType="multipart/form-data" ref={this.handleFormRef}>
                  <label htmlFor={this.state.id} className="ui button">Edit Image</label>
                  <input type="hidden" name="filename" value={foodItem.description}/>
                  <input id={this.state.id} className="hidden-file-input"
                         name="image" type="file" accept="image/*" capture="camera"
                         onChange={this.updateImage}/>
                </form>
            </div>
            </div>
          </div>
          <img src={imageUrl} ref={this.handleDimmerRef}/>
        </div>
      );
      content = (
        <div className="ui grid">
          <div className="five wide column"><h5>Quantity</h5></div>
          <div className="eleven wide column">
            <div className="ui fluid right action input">
              <input type="number" placeholder="3" min="1" style={{ textAlign: 'right'}}/>
              <div className="ui basic compact dropdown button" ref={this.handleDropdownRef}>
                <div className="text">tbps</div>
                <i className="dropdown icon"></i>
                <div className="menu">
                  <div className="item">tsps</div>
                  <div className="item">tbps</div>
                  <div className="item">quarter cup</div>
                  <div className="item">cup</div>
                </div>
              </div>
            </div>
          </div>
          <div className="five wide column"><h5>Serving Size</h5></div>
          <div className="eleven wide column">
            <div className="ui fluid right action input">
              <input type="number" placeholder="3" min="1" style={{ textAlign: 'right'}}/>
              <div className="ui basic compact dropdown button" ref={this.handleDropdownRef}>
                <div className="text">tbps</div>
                <i className="dropdown icon"></i>
                <div className="menu">
                  <div className="item">tsps</div>
                  <div className="item">tbps</div>
                  <div className="item">quarter cup</div>
                  <div className="item">cup</div>
                </div>
              </div>
            </div>
          </div>
          <div className="five wide column"><h5>Expiration</h5></div>
          <div className="eleven wide column">
            <div className="ui fluid right action input">
              <input type="number" placeholder="3" min="1" style={{ textAlign: 'right'}}/>
              <div className="ui basic compact dropdown button" ref={this.handleDropdownRef}>
              <div className="text">weeks</div>
              <i className="dropdown icon"></i>
              <div className="menu">
                <div className="item">days</div>
                <div className="item">weeks</div>
                <div className="item">months</div>
              </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="food-editor-container">
        { image }
        { header }
        <div className="content">{ content }</div>
      </div>
    );
  }
});

export default FoodEditorHandler;
