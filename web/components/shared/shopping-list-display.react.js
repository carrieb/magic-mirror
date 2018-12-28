import React from 'react';

import { convertToQty } from 'src/common/quantities';

import { withKitchen } from 'state/KitchenState';
import { withCategories } from 'components/common/hoc/withCategories.react';

import { tr } from 'util/translation-util';

import _isEmpty from 'lodash/isEmpty';
import _find from 'lodash/find';
import _groupBy from 'lodash/groupBy';
import _uniqueId from 'lodash/uniqueId';
import _kebabCase from 'lodash/kebabCase';

class ItemsSection extends React.Component {
  componentDidMount() {
    this.resort();
  }

  componentDidUpdate() {
    this.resort();
  }

  resort = () => {
    $(this.table).tablesort();
    $('.checkbox').checkbox();
  }

  handleTableRef = (ref) => {
    this.table = ref;
  }

  render() {
    //console.log(this.props);
    const trs = this.props.items.map((item) => {
      const cat = item.category ? item.category : 'other';

      // attempt to popuate meta from existing supply
      let meta = null;
      let inInventory = false;

      if (!_isEmpty(this.props.kitchenIndex)) {
        const supply = _find(
          Object.values(this.props.kitchenIndex),
          (o) => o.description.toLowerCase() === item.name.toLowerCase()
        );

        if (supply && supply.quantity.amount > 0) {
          const qtySup = convertToQty(supply.quantity);
          const qtyNeed = convertToQty(item.quantity);

          if (qtySup && qtyNeed) {
            const quantityText = supply.quantity.unit && supply.quantity.unit.length > 0
              ? tr(`quantities.units.${supply.quantity.unit}`, { smart_count: supply.quantity.amount }, true)
              : supply.quantity.amount;
            if (!qtySup.isCompatible(qtyNeed)) {
              meta = <span key="dunno">
                <i className="blue question icon"/>
                <a href={`/kitchen/item/${supply.description}`}>
                  { tr('quantities.inventory', { quantity: quantityText }, true) }
                </a>
              </span>;
            } else if (qtySup.gte(qtyNeed)) {
              inInventory = true;
              meta = <span key="check">
                <i className="green check icon"/>
                <a href={`/kitchen/item/${supply.description}`}>
                  { tr('quantities.inventory', { quantity: quantityText }, true) }
                </a>
              </span>;
            }
          }

          if (meta == null) {
            const quantityText = supply.quantity.unit && supply.quantity.unit.length > 0
              ? tr(`quantities.units.${supply.quantity.unit}`, { smart_count: supply.quantity.amount }, true)
              : `${supply.quantity.amount} in inventory`;
            meta = <a key="meta" href={`/kitchen/item/${supply.description}`}>{ tr('quantities.inventory', { quantity: quantityText }, true) }</a>;
          }
        }
      }

      const quantityText = item.quantity.unit && item.quantity.unit.length > 0
        ? tr(`quantities.units.${item.quantity.unit}`, { smart_count: item.quantity.amount }, true)
        : item.quantity.amount;

      return (
        <tr key={item.name}>
          <td className="four wide">
            { tr(`ingredients.names.${item.name}`) }
          </td>
          <td className="two wide" style={{ textTransform: 'capitalize' }}>
            { tr(`ingredients.categories.${cat}`) }
          </td>
          <td style={{ textTransform: 'capitalize' }}>
            { item.recipes.map(r => <div key={r.id}><a href={`/recipes/r/${r.id}`}>{ tr(`recipes.names.${r.name}`) }</a></div>) }
          </td>
          <td>
            {quantityText} {meta && [<br key="br"/>, meta]}
          </td>
          <td className="one wide">
            <div className="ui checkbox">
              <input type="checkbox" checked={inInventory} onChange={ () => {} }/>
            </div>
          </td>
        </tr>
      );
    });

    return (
      <table className="ui very basic sortable celled table" key={_uniqueId()} ref={this.handleTableRef}>
        <thead>
          <tr>
            <th className="four wide">{ tr('table.column.name') }</th>
            <th className="two wide">{ tr('table.column.category') }</th>
            <th>{ tr('table.column.recipes') }</th>
            <th>{ tr('table.column.amount') }</th>
            <th/>
          </tr>
        </thead>
        <tbody>
          { trs }
        </tbody>
      </table>
    )
  }
}

export default withKitchen(withCategories(ItemsSection));
