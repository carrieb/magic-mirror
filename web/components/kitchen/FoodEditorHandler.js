import React from 'react';

import ApiWrapper from '../../util/api-wrapper';
import KitchenState from '../../state/KitchenState';

import DropdownOptions from '../common/dropdown-options';
import InputDropdownGroup from '../common/input-dropdown-group.react';

import ExpirationFormField from './item/form/ExpirationFormField.react';
import ServingSizeFormField from './item/form/ServingSizeFormField.react';
import QuantityFormField from './item/form/QuantityFormField.react';

import uniqueId from 'lodash/uniqueId';
import isEqual from 'lodash/isEqual';

const FoodEditorHandler = React.createClass({
  componentWillMount() {
    this.reloadItem();
  },

  getInitialState() {
    return {
      foodItem: {},
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

  updateFields() {
    const food = this.state.foodItem;
    console.log(food);
    ApiWrapper.updateFood(food);
  },

  onExpirationChange(expiration) {
    const foodItem = this.state.foodItem;
    foodItem.expiration = expiration;
    this.setState({ foodItem });
  },

  onServingSizeChange(servingSize) {
    const foodItem = this.state.foodItem;
    foodItem.servingSize = servingSize;
    this.setState({ foodItem });
  },

  onQuantityChange(quantity) {
    const foodItem = this.state.foodItem;
    foodItem.quantity = quantity;
    this.setState({ foodItem });
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
          <QuantityFormField className="eleven wide column"
            quantity={this.state.foodItem.quantity}
            onChange={this.onQuantityChange}/>
          <div className="five wide column"><h5>Serving Size</h5></div>
          <ServingSizeFormField className="eleven wide column"
            servingSize={this.state.foodItem.servingSize}
            onChange={this.onServingSizeChange}/>
          <div className="five wide column"><h5>Expiration</h5></div>
          <ExpirationFormField className="eleven wide column"
            expiration={this.state.foodItem.expiration}
            onChange={this.onExpirationChange}/>
          <div className="sixteen wide column"><button className="ui green fluid button" onClick={this.updateFields}>Submit</button></div>
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
