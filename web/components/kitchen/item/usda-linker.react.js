import React from 'react';
import PropTypes from 'prop-types';

import ApiWrapper from 'util/api-wrapper';

import { withKitchen } from 'state/KitchenState';

class USDALinker extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      results: [],
      query: this.props.defaultQuery || '',
      USDAData: null
    }
  }


  search = () => {
    const query = this.state.query;
    ApiWrapper.searchUSDA(query)
      .done((results) => {
        console.log(results);
        this.setState({
          results
        })
      });
  }

  retrieve = (ndbno) => {
    ApiWrapper.retrieveUSDAData(ndbno)
      .done((USDAData) => {
        console.log(USDAData);
        // TODO: suggest updating quantity
        const proximates = USDAData.report.food.nutrients[0];
        const singleServingAmt = proximates.measures[0].eqv;
        const singleServingUnit = proximates.measures[0].eunit;

        this.setState({ USDAData });

        console.log(`Each serving: ${singleServingAmt} ${singleServingUnit}.`);
      });
  }

  link = (ndbno) => {
    return () => {
      const item = this.props.kitchenIndex[this.props.itemId];
      item.ndbno = ndbno;
      ApiWrapper.updateFood(item)
        .done(() => {
          this.props.updateItem(this.props.itemId, item);
          toastr.success(`Successfully linked ${item.name || item.description} to ndbno: ${ndbno}.`, '', {
            positionClass: 'toast-bottom-full-width',
            progressBar: true,
            timeOut: 2000
          });
          this.retrieve(ndbno);
        });
    }
  }

  render() {
    const results = this.state.results.map((result, i) => <tr key={i}>
      <td>{ result.name }</td>
      <td>{ result.ndbno }</td>
      <td>{ result.group }</td>
      <td>{ result.manu }</td>
      <td><i className="ui green linkify icon" onClick={ this.link(result.ndbno) }/></td>
    </tr>);
    return (
      <div className="usda-linker">
        <div className="ui fluid action input">
          <input type="text"
                 value={this.state.query}
                 onChange={(ev) => { this.setState({ query: ev.target.value }); }}/>
          <button className="ui right labeled icon button" onClick={this.search}>
            <i className="search icon"/>
            Search
          </button>
        </div>
        { results.length > 0 && <table className="ui table">
          <thead><tr>
            <th>Name</th>
            <th>NDB no</th>
            <th>Group</th>
            <th>Manufacturer</th>
            <th/>
          </tr></thead>
          <tbody>
            { results }
          </tbody>
        </table> }
      </div>
    );
  }
}

USDALinker.propTypes = {
  defaultQuery: PropTypes.string,
  itemId: PropTypes.string
}

export default withKitchen(USDALinker);
