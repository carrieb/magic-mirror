import React from 'react';
import { withRouter } from 'react-router-dom'

import ApiWrapper from '../../util/api-wrapper';
import { DEFAULT_ITEM, withKitchen } from 'state/KitchenState';
import KitchenConstants from 'state/kitchen/kitchen-constants';

import LocalStorageUtil from 'util/local-storage-util';

import ControlledItemEditor from 'components/kitchen/controlled-item-editor.react';

import KitchenItemFeed from 'components/kitchen/item/kitchen-item-feed.react';
import RecipesForItem from 'components/kitchen/recipes-for-item.react';
import USDALinker from 'components/kitchen/item/usda-linker.react';

import uniqueId from 'lodash/uniqueId';
import _isEmpty from 'lodash/isEmpty';
import _isString from 'lodash/isString';
import _isEqual from 'lodash/isEqual'
import _clone from 'lodash/clone';
import _lowerCase from 'lodash/lowerCase';
import _find from 'lodash/find';
import _values from 'lodash/values';

import 'sass/kitchen/food-editor.scss';

class KitchenItemEditor extends React.Component {
  constructor(props) {
    super(props);
    //console.log('food editor props', props);

    const name = _lowerCase(this.props.match.params.foodName);
    let foodItem = _clone(DEFAULT_ITEM);
    // try looking it up in the kitchen index
    const loadedItem = this.lookupDetails(name);

    //console.log(props, this.props.match.params.foodName, loadedItem);

    if (!_isEmpty(loadedItem)) {
      foodItem = loadedItem;
    } else {
      foodItem.description = name;
      foodItem.zone = LocalStorageUtil.getLastZone() || DEFAULT_ITEM.zone;
      foodItem.category = LocalStorageUtil.getLastCategory() || DEFAULT_ITEM.category;
    }

    //console.log('constructor', foodItem);

    this.state = {
      foodItem,
      id: uniqueId(),
      editingName: false,
      error: null,
      showUSDA: false,
      USDAQuery: null
    };
  }

  lookupDetails = (name) => _find(this.props.kitchenIndex,
      (item) => item.name ? _lowerCase(item.name) === name : _lowerCase(item.description) === name);

  componentWillMount() {
    if (this.state.foodItem === null) {
      this.loadItem();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    //console.log('did update', prevProps, this.props, this.state);
    if (this.state.editingName) {
      // focus on that span
      //console.log('focusing on name input');
      $(this.nameInput).focus();
    }

    if (this.props.match.params.foodName !== prevProps.match.params.foodName) {
      //console.log(`props foodName change, finding ${this.state.foodItem.description} in the kitchen index`)
      /* console.log(_values(this.props.kitchenIndex).map((item) => {
       *  return item.description
       * }).sort())
       */
      const me = _find(this.props.kitchenIndex,
        (item) => (item) =>  {
          const myName = this.state.foodItem.description || this.state.foodItem.name;
          const theirName = item.description || item.name;
          return _lowerCase(myName) === _lowerCase(theirName);
        });
      if (!_isEmpty(me)) {
        //console.log('found', me);
        this.setState({ foodItem: me });
      }
    }

    if (!_isEqual(prevProps.kitchenIndex, this.props.kitchenIndex)) {
      // attempt to look myself up
      // console.log('looking myself up');

      //console.log(`kitchen index update, finding ${this.state.foodItem.description} in the kitchen index`)
      //console.log(_values(this.props.kitchenIndex).map((item) => {
      //  return item.description
      // }).sort())
      const me = _find(this.props.kitchenIndex,
        (item) =>  {
          const myName = this.state.foodItem.description || this.state.foodItem.name;
          const theirName = item.description || item.name;
          return _lowerCase(myName) === _lowerCase(theirName);
        });
      if (!_isEmpty(me)) {
        console.log('found', me);
        this.setState({ foodItem: me });
      }
    }
  }

  loadItem = () => {
    const name = this.props.match.params.foodName;
  };

  updateFoodItem = (field, value) => {
    // console.log(this.state);
    const foodItem = this.state.foodItem;
    foodItem[field] = value;
    this.setState({ foodItem });
  }

  handleDimmerRef = (ref) => {
    this.dimmer = ref;
    if (this.dimmer) {
      $(this.dimmer).dimmer({ on: 'hover' });
    }
  }

  handleFormRef = (ref) => {
    this.form = ref;
  }

  updateImage = (ev) => {
    // Must do ajax submit so page doesn't refresh.
    // TODO: upload image asynchronoustly
    // http://stackoverflow.com/questions/166221/how-can-i-upload-files-asynchronously
    // display loading spinner til done, then set the image url
    if (ev.target.files && ev.target.files[0]) {
      ApiWrapper.uploadFoodImage(this.form, (loaded, total) => {
        //console.log(loaded, total);
      }).done((filename) => {
        //console.log('done', filename, this.props.match.params.foodName);
        const foodItem = this.state.foodItem;
        toastr.success(`Successfully uploaded image for ${foodItem.name || foodItem.description}`);
        foodItem.img = filename;
        this.setState({ foodItem });
      }).fail(() => {
        console.error('failed');
      });
    }
  }

  updateFields = () => {
    const food = this.state.foodItem;
    // console.log(food);

    this.props.newUpdateItem(food);
  }

  showLinkUSDA = () => {
    this.setState({
      showUSDA: true
    });
  }

  toggleNameEdit() {
    this.setState({ editingName: true });
  }

  editName() {
    const foodItem = this.state.foodItem;
    foodItem.description = this.nameInput.innerText;
    foodItem.name = this.nameInput.innerText;
    this.setState({ editingName: false, foodItem });
    // TODO: add this item in the kitchen then navigate

    // TODO: WARN/FAIL if we already have an item named this
    // this.props.history.push(`/kitchen/item/${foodItem.description}`);
  }

  handleKeypress(ev) {
    if (ev.key === 'Enter') {
      ev.preventDefault();
      this.editName();
    }
  }

  render() {
    const foodItem = this.state.foodItem;
    // console.log(this.props, this.state);
    // console.log(foodItem, this.props.kitchenIndex[foodItem._id]);

    // (<div className="ui transparent input">
    //   <input
    //     type="text"
    //     defaultValue={foodItem.description}
    //     ref={(ref) => this.nameInput = ref}/>
    // </div>);

    // TODO: add warning message if creating a new item (no _id)
    // but there's already something in the kithen index.

    //console.log('render editor handler', foodItem, this.props);

    const name = foodItem.description || foodItem.name;

    const headerContent = this.state.editingName
      ? <div>
          <span ref={(ref) => this.nameInput = ref}
            suppressContentEditableWarning={true}
            contentEditable="true" placeholder="AAA"
            onKeyPress={(ev) => this.handleKeypress(ev)}>{ name }</span>
          <a onClick={() => this.editName()}><i className="check icon"></i></a>
        </div>
    :  name;
    const header = (
      <h2 className="ui horizontal divider header" onDoubleClick={() => this.toggleNameEdit()}>
        { headerContent }
      </h2>
    );

    let imageUrl = foodItem.img ? `/food-images/${foodItem.img}` : '/images/no-image.svg';
    const image = (
      <div className="blurring dimmable image" ref={(r) => this.handleDimmerRef(r)}>
        <div className="ui inverted dimmer">
          <div className="content">
            <div className="center">
              <form encType="multipart/form-data" ref={(r) => this.handleFormRef(r)}>
                <label htmlFor={this.state.id} className="ui button">Edit Image</label>
                <input type="hidden" name="filename" value={name}/>
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

    const content = (
      <div>
        <ControlledItemEditor foodItem={foodItem}
                              onChange={this.updateFoodItem}/>
        <button className="ui green fluid button" style={{ marginTop: '20px' }}
                onClick={this.updateFields}>Done</button>
        <button className="ui fluid violet icon button"
                style={{ marginTop: '20px' }}
                onClick={this.showLinkUSDA}>
          <i className="linkify icon"/>
          { foodItem.ndbno ? `Linked to USDA food ndbno: ${foodItem.ndbno }` : 'Link to USDA food database' }
        </button>
        { this.state.showUSDA && <USDALinker itemId={foodItem._id} defaultQuery={name}/> }
      </div>
    );

    // TODO: split this into a full page view and rework this component to be purely the editor

    return (
      <div className="food-editor-container">
        { header }
        <div className="ui stackable grid">
          <div className="six wide column">
            { image }
            <KitchenItemFeed item={this.state.foodItem}/>
          </div>
          <div className="ten wide column">
            { this.state.error && <div className="error-text">{this.state.error}</div>}
            <div className="content">{ content }</div>
          </div>
          <div className="sixteen wide column">
            <RecipesForItem ingredient={name}/>
          </div>
        </div>
      </div>
    );
  }
}



export default withRouter(withKitchen(KitchenItemEditor));
