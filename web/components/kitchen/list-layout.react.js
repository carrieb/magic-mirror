import React from 'react';

class ListLayout extends React.Component {
  render() {
    return (
      <table className="ui sortable unstackable table">
        <thead>
          <tr>
            <th></th>
            <th>Name </th>
            <th></th>
          </tr>
        </thead>
          <tbody>
          { this.props.children }
          </tbody>
        <tfoot>
          <tr>
            <th>{this.props.children.length} Items</th>
          </tr>
        </tfoot>
      </table>
    )
  }
}

module.exports = ListLayout;
