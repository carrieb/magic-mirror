import React from 'react';
import PropTypes from 'prop-types';

import moment from 'moment';
import uniqueId from 'lodash/uniqueId';
import _noop from 'lodash/noop';
import _startCase from 'lodash/startCase';
import _kebabCase from 'lodash/kebabCase';

import { withKitchen } from 'state/KitchenState';
import ShoppingListState from 'state/ShoppingListState';

import { Link } from 'react-router-dom';

import 'sass/kitchen/food-card.scss';

class KitchenItemCard extends React.Component {
  constructor(props) {
    super(props);
    this.addToShoppingList = this.addToShoppingList.bind(this);

    this.state = {
      flipped: false,
      id: uniqueId()
    };
  }

  addToShoppingList() {
    ShoppingListState.addItem(this.props.foodItem);
    this.props.handlePlusClick(this.props.foodItem);
  }

  // $(this.card).transition({
  //   animation: 'horizontal flip',
  //   onComplete: () => { this.setState({ flipped: !this.state.flipped }); }
  // }).transition('horizontal flip');
  handleTrashClick() {
    if (this.props.delete) {
      this.props.delete(this.props.foodItem._id);
    }
  }

  render() {
    const foodItem = this.props.kitchenIndex[this.props.itemId] || {};
    let zone = foodItem.zone || 'Fridge';
    let category = foodItem.category || 'Condiment';

    let imageUrl = foodItem.img ? `/food-images/${foodItem.img}` : '/food-images/no-image.png';
    const image = (
      <div className="image">
        { foodItem.starred && <div className="ui yellow left corner label"><i className="star icon"/></div> }
        <img src={imageUrl}/>
      </div>
    );

    const content = (
      <div className="content">
        <div className="header">
          <span data-tooltip={category} data-position="right center"><img src={`/images/kitchen/${category}.png`}/></span>
          <span className="title">{_startCase(foodItem.description)}</span>
        </div>
        <div className="meta">
          <a>{zone}</a><br/>
        </div>
      </div>
    );

    let lastImport = null;
    if (foodItem.importDates) {
      const lastImportDate = moment(foodItem.importDates[foodItem.importDates.length - 1], "MM/DD/YYYY")
      lastImport = `${lastImportDate.toNow(true)} old`
    }
    const extraContent = (
      <div className="extra content">
        <span className="left floated">
          <i className={`${foodItem.starred ? 'yellow' : '' } star icon`} onClick={this.props.star(foodItem._id, !foodItem.starred)}></i>
          <Link to={`/kitchen/item/${_kebabCase(foodItem.description)}`}>
            <i className="link setting icon"></i>
          </Link>
          <i className="plus link icon" onClick={this.addToShoppingList}/>
        </span>
        <span className="right floated">
          { lastImport }
        </span>
      </div>
    );

    return (
      <div className="ui card food-card" >
        { image }
        { content }
        { extraContent }
      </div>
    );
  }
}

KitchenItemCard.propTypes = {
  foodItem: PropTypes.object.isRequired,
  itemId: PropTypes.string.isRequired,
  star: PropTypes.func,
  handlePlusClick: PropTypes.func
};

KitchenItemCard.defaultProps = {
  star: _noop,
  handlePlusClick: _noop
}

export default withKitchen(KitchenItemCard);
