import React from 'react';
import PropTypes from 'prop-types';

import moment from 'moment';
import uniqueId from 'lodash/uniqueId';
import _noop from 'lodash/noop';

import { Link } from 'react-router-dom';

import 'sass/kitchen/food-card.scss';

class KitchenItemCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      flipped: false,
      id: uniqueId()
    };
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
    const foodItem = this.props.foodItem;
    let zone = foodItem.zone || 'Fridge';
    let category = foodItem.category || 'Condiment';

    let imageUrl = foodItem.img ? `/food-images/${foodItem.img}` : '/food-images/no-image.png';
    const image = (
      <div className="image"><img src={imageUrl}/></div>
    );

    const content = (
      <div className="content">
        <div className="header">
          <span className="title">{foodItem.description}</span>
        </div>
        <div className="meta">
          <a>{zone}</a><br/>
          <a>{category}</a>
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
          <i className="star icon" onClick={this.props.star}></i>
          <Link to={`/kitchen/${foodItem.description}`}>
            <i className="grey link setting icon"></i>
          </Link>
        </span>
        <span className="right floated">
          { lastImport }
          <i className="trash icon" onClick={(ev) => this.handleTrashClick()}></i>
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
  star: PropTypes.func
};

KitchenItemCard.defaultProps = {
  star: _noop
}

export default KitchenItemCard;
