import React from 'react';

import KitchenItemTableRow from 'components/kitchen/item/table-row.react';

import { withCategories } from 'components/common/hoc/withCategories.react';
import { withZones } from 'components/common/hoc/withZones.react';

import { ALL_ITEM_FIELDS } from 'state/kitchen/kitchen-constants';

import { tr } from 'util/translation-util';

import _intersection from 'lodash/intersection';
import _range from 'lodash/range';

import 'sass/kitchen/table-layout.scss';

class ItemsTable extends React.Component {
  componentDidMount() {
    $(this.table).tablesort().data('tablesort').sort($(this.defaultSort));
  }

  componentDidUpdate() {
    $(this.table).tablesort().data('tablesort').sort($(this.defaultSort));
  }

  render() {
    const items = this.props.items || [];
    const tableItems = items.map((item) => <KitchenItemTableRow key={item._id} item={item} fields={this.props.fields}/>);

    // TODO: make columns selectable

    const orderedColumns = _intersection(ALL_ITEM_FIELDS, this.props.fields);
    const columns = orderedColumns.map((field) => {
      if (field === 'name') {
        return <th key={field} ref={(defaultSort) => { this.defaultSort = defaultSort }}>{ tr(`table.column.${field}`) }</th>
      } else {
        return <th key={field}>{ field === 'usda ndbno' && <i className="ui linkify icon"/> }{ tr(`table.column.${field}`) }</th>;
      }
    });

    return (
      <table className="ui sortable unstackable table" ref={(ref) => { this.table = ref }}>
        <thead>
          <tr>
            <th/>
            { columns }
          </tr>
        </thead>
        <tbody>
          { tableItems }
        </tbody>
        <tfoot>
          <tr>
            <th/>
            <th>{items.length} Items</th>
            { _range(orderedColumns.length - 1).map((i) => <th key={i}/>) }
          </tr>
        </tfoot>
      </table>
    );
  }

}

module.exports = withZones(withCategories(ItemsTable));
