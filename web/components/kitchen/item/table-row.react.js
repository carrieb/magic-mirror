import React from 'react';
import { Link } from 'react-router-dom'

import 'sass/kitchen/item/table-row.scss';

import { tr } from 'util/translation-util';

import _kebabCase from 'lodash/kebabCase';

const fieldToContent = (field, item) => {
  const lookup = {
    'name': () =>
      <Link to={`/kitchen/item/${item.name || item.description}`}>{ item.name || item.description }</Link>,
    'category': () =>
      <span>
        <img className="ui avatar image category"
             src={`/images/kitchen/${_kebabCase(item.category.toLowerCase())}.png`}/>
        { item.category }
      </span>,
    'zone': () => null,
    'quantity': () =>
      <span>{ item.quantity.amount } { item.quantity.unit }</span>,
    'expiration': () =>
      <span>Lasts { item.expiration.length } { item.expiration.delta }</span>,
    'usda-ndbno': () => item.ndbno
  }

  if (item[field] || field === 'name') {
    const contentGenerator = lookup[field];
    return contentGenerator();
  } else {
    return null;
  }
}

class KitchenItemTableRow extends React.Component {
  render() {
    const item = this.props.item || {};

    const imageUrl = item.img ? `/food-images/${item.img}` : '/food-images/no-image.png';
    const name = item.description || item.name;
    const columns = this.props.fields.map((field) => {
      return <td key={field}>{ fieldToContent(field, item) }</td>
    });

    return (
      <tr className="kitchen-item-list-item">
        <td><img src={imageUrl}/></td>
        { columns }
      </tr>
    );
  }
}

export default KitchenItemTableRow;
