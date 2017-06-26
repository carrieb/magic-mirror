import React from 'react';

import moment from 'moment';
import uniqueId from 'lodash/uniqueId';

import { Link } from 'react-router';

const KitchenItemCard = React.createClass({
  propTypes: {
    foodItem: React.PropTypes.object.isRequired,
    onSettingsClick: React.PropTypes.func
  },

  getInitialState() {
    return {
      flipped: false,
      id: uniqueId()
    };
  },

  // $(this.card).transition({
  //   animation: 'horizontal flip',
  //   onComplete: () => { this.setState({ flipped: !this.state.flipped }); }
  // }).transition('horizontal flip');

  handleCardRef(ref) {
    this.card = ref;
  },

  render() {
    const foodItem = this.props.foodItem;
    let area = foodItem.area || 'Fridge';
    let imageUrl = foodItem.img ? `/food-images/${foodItem.img}` : '/food-images/no-image.png';
    let content;
    let image;
    let extraContent;

    image = (
      <div className="image"><img src={imageUrl}/></div>
    );
    content = (
      <div className="content">
        <i className="right floated large star icon"></i>
        <Link to={`/kitchen/${foodItem.description}`}><i className="grey right floated large link setting icon"></i></Link>
        <div className="header">{foodItem.description}</div>
        <div className="meta">
          <a>{area}</a>
        </div>
      </div>
    );
    let lastImport = null;
    if (foodItem.importDates) {
      const lastImportDate = moment(foodItem.importDates[foodItem.importDates.length - 1], "MM/DD/YYYY")
      lastImport = `${lastImportDate.toNow(true)} old`
    }
    extraContent = (
      <div className="extra content">
        <span>
          <i className="cube icon"></i>

        </span>
        <span className="right floated">
          { lastImport }
        </span>
      </div>
    );

    return (
      <div className="ui card food-item-card" ref={this.handleCardRef}>
        { image }
        { content }
        { extraContent }
      </div>
    );
  }
});

export default KitchenItemCard;
