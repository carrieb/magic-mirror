import React from 'react';
import { withRouter } from 'react-router-dom'

import ApiWrapper from '../../util/api-wrapper';
import KitchenState from '../../state/KitchenState';
import KitchenConstants from 'state/kitchen/kitchen-constants';

import Dropdown from 'components/common/dropdown.react';
import DropdownOptions from 'components/common/dropdown-options';
import InputDropdownGroup from 'components/common/input-dropdown-group.react';

import ExpirationFormField from './item/form/ExpirationFormField.react';
import ServingSizeFormField from './item/form/ServingSizeFormField.react';
import QuantityFormField from './item/form/QuantityFormField.react';

import uniqueId from 'lodash/uniqueId';
import _isEmpty from 'lodash/isEmpty';
import _isString from 'lodash/isString';
import _clone from 'lodash/clone';

import 'sass/kitchen/food-editor.scss';

class FoodEditorHandler extends React.Component {
  constructor(props) {
    super(props);

    const name = this.props.match.params.foodName;
    const foodItem = _clone(KitchenState.DEFAULT_ITEM);
    foodItem.description = name;

    this.handleFormRef = this.handleFormRef.bind(this);
    this.updateImage = this.updateImage.bind(this);
    this.onZoneChange = this.onZoneChange.bind(this);
    this.onCategoryChange = this.onCategoryChange.bind(this);

    this.state = {
      foodItem,
      id: uniqueId(),
      editingName: false,
      error: null
    };
  }

  componentWillMount() {
    this.loadItem();
  }

  componentDidUpdate() {
    if (this.state.editingName) {
      // focus on that span
      $(this.nameInput).focus();
    }
  }

  loadItem() {
    const name = this.props.match.params.foodName;
    KitchenState.findFood(name, (foodItem) => {
      if (!_isEmpty(foodItem)) {
        this.setState({ foodItem });
      }
    });
  }

  handleDimmerRef(ref) {
    this.dimmer = ref;
    if (this.dimmer) {
      $(this.dimmer).dimmer({ on: 'hover' });
    }
  }

  handleFormRef(ref) {
    this.form = ref;
  }

  updateImage(ev) {
    // Must do ajax submit so page doesn't refresh.
    // TODO: upload image asynchronoustly
    // http://stackoverflow.com/questions/166221/how-can-i-upload-files-asynchronously
    // display loading spinner til done, then set the image url
    if (ev.target.files && ev.target.files[0]) {
      ApiWrapper.uploadFoodImage(this.form, (loaded, total) => {
        console.log(loaded, total);
      }).done((filename) => {
        console.log('done', filename, this.props.match.params.foodName);
        const foodItem = this.state.foodItem;
        foodItem.img = filename;
        this.setState({ foodItem });
        KitchenState.updateImage(this.props.match.params.foodName, filename);
      }).fail(() => {
        console.error('failed');
      });
    }
  }

  updateFields() {
    const food = this.state.foodItem;
    console.log(food);
    if (!food._id) {
      console.log('new new new');
      // ensure that name is not new
      if (this.state.foodItem.description === 'new') {
        console.log(this.state.foodItem.description);
        this.setState({ error: 'Name must be provided to save!'});
        return;
      }
    }

    // TODO: move this to kitchen state
    ApiWrapper.updateFood(food)
      .done((insertedId) => {
        const foodItem = this.state.foodItem;
        if (_isString(insertedId)) {
          console.log('updated food', insertedId);
          foodItem._id = insertedId;
          KitchenState.addItem(food);
        }
        this.props.history.push('/kitchen')
      });
  }

  onExpirationChange(expiration) {
    console.log(this);
    const foodItem = this.state.foodItem;
    foodItem.expiration = expiration;
    this.setState({ foodItem });
  }

  onServingSizeChange(servingSize) {
    const foodItem = this.state.foodItem;
    foodItem.servingSize = servingSize;
    this.setState({ foodItem });
  }

  onQuantityChange(quantity) {
    const foodItem = this.state.foodItem;
    foodItem.quantity = quantity;
    this.setState({ foodItem });
  }

  onCategoryChange(value, text, choice) {
    const foodItem = this.state.foodItem;
    foodItem.category = value;
    this.setState({ foodItem });
  }

  onZoneChange(value, text, choice) {
    const foodItem = this.state.foodItem;
    foodItem.zone = value;
    this.setState({ foodItem });
  }

  toggleNameEdit() {
    this.setState({ editingName: true });
  }

  editName() {
    const foodItem = this.state.foodItem;
    foodItem.description = this.nameInput.innerText;
    this.setState({ editingName: false });
    // TODO: WARN/FAIL if we already have an item named this
    this.props.history.push(`/kitchen/${foodItem.description}`);
  }

  handleKeypress(ev) {
    if (ev.key === 'Enter') {
      ev.preventDefault();
      this.editName();
    }
  }

  render() {
    const foodItem = this.state.foodItem;

    // (<div className="ui transparent input">
    //   <input
    //     type="text"
    //     defaultValue={foodItem.description}
    //     ref={(ref) => this.nameInput = ref}/>
    // </div>);

    console.log(foodItem);

    const headerContent = this.state.editingName
      ? <div>
          <span ref={(ref) => this.nameInput = ref}
            suppressContentEditableWarning={true}
            contentEditable="true" placeholder="AAA"
            onKeyPress={(ev) => this.handleKeypress(ev)}>{foodItem.description}</span>
          <a onClick={() => this.editName()}><i className="check icon"></i></a>
        </div>
    :  foodItem.description;
    const header = (
      <h4 className="ui horizontal divider header" onDoubleClick={() => this.toggleNameEdit()}>
        <i className="food icon"></i>
        { headerContent }
       </h4>
    );

    let imageUrl = foodItem.img ? `/food-images/${foodItem.img}` : '/food-images/no-image.png';
    const image = (
      <div className="blurring dimmable image" ref={(r) => this.handleDimmerRef(r)}>
        <div className="ui inverted dimmer">
          <div className="content">
            <div className="center">
              <form encType="multipart/form-data" ref={(r) => this.handleFormRef(r)}>
                <label htmlFor={this.state.id} className="ui button">Edit Image</label>
                <input type="hidden" name="filename" value={foodItem.description}/>
                <input id={this.state.id} className="hidden-file-input"
                       name="image" type="file" accept="image/*" capture="camera"
                       onChange={(ev) => this.updateImage(ev)}/>
              </form>

          </div>
          </div>
        </div>
        <img src={imageUrl}/>
      </div>
    );

    const valueToOption = (val) => (
      <div className="item" data-value={val} key={val}> 
        <img className="ui mini avatar image" src={`/images/kitchen/${val.toLowerCase()}.png`}/>
        {val}
      </div>
    );

    const zoneOptions = KitchenConstants.ALL_ZONES.map(valueToOption);
    const categoryOptions = KitchenConstants.ALL_CATEGORIES.map(valueToOption);

    const content = (
      <div className="ui grid">
        <div className="five wide column">
          <h5>Quantity </h5>
        </div>
        <QuantityFormField className="eleven wide column"
          quantity={this.state.foodItem.quantity}
          onChange={(q) => this.onQuantityChange(q)}/>

        <div className="five wide column">
          <h5>Serving Size</h5>
        </div>
        <ServingSizeFormField className="eleven wide column"
          servingSize={this.state.foodItem.servingSize}
          onChange={(ss) => this.onServingSizeChange(ss)}/>

        <div className="five wide column">
          <h5>Expiration</h5>
        </div>
        <ExpirationFormField className="eleven wide column"
          expiration={this.state.foodItem.expiration}
          onChange={(exp) => this.onExpirationChange(exp)}/>

        <div className="five wide column">
          <h5>Category</h5>
        </div>
        <div className="eleven wide column">
          <Dropdown className="fluid selection category-dropdown"
                    defaultValue={ this.state.foodItem.category }
                    options={{ onChange: this.onCategoryChange }}>
            { categoryOptions }
          </Dropdown>
        </div>

        <div className="five wide column">
          <h5>Zone</h5>
        </div>
        <div className="eleven wide column">
          <Dropdown className="fluid selection zone-dropdown"
                    defaultValue={ this.state.foodItem.zone }
                    options={{ onChange: this.onZoneChange }}>
            { zoneOptions }
          </Dropdown>
        </div>

        <div className="sixteen wide column">
          <button className="ui green fluid button" onClick={() => this.updateFields()}>Done</button>
        </div>
      </div>
    );

    return (
      <div className="food-editor-container">
        { image }
        { header }
        { this.state.error && <div className="error-text">{this.state.error}</div>}
        <div className="content">{ content }</div>
      </div>
    );
  }
}



export default withRouter(FoodEditorHandler);
