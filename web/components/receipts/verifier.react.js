import React from 'react';

import ApiWrapper from '../../util/api-wrapper';
import ItemInputs from './item-inputs';

import AddReceiptItemsForm from '../kitchen/add-receipt-items-form.react';

import { DEFAULT_ITEM } from 'state/KitchenState';

import 'sass/receipts/verifier.scss';

import _assign from 'lodash/assign';
import _clone from 'lodash/clone';

// TODO: Update this to use more recent editor from ingedients inputs?

class Verifier extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      filename: this.props.match.params.filename,
      items: [],
      loaded: false,
      submitted: false,
      collapsed: true,
      error: false
    };
  }

  componentWillMount() {
    const filename = this.props.match.params.filename;
    if (filename) {
      ApiWrapper.extractText(filename)
        .done((partialItems) => {
          const items = partialItems.map((item) => {
            const def = _clone(DEFAULT_ITEM);
            const result = _assign(def, item);
            return result;
          });
          this.setState({ items, loaded: true });
        })
        .fail(() => {
          this.setState({ error: true });
        });
    }
  }

  submitItems = (ev) => {
    ApiWrapper.submitReceiptItems(this.state.items)
      .done(() => {
        this.setState({ submitted: true });
      });
    ev.preventDefault();
  }

  updateItems = (items) => {
    this.setState({ items });
  }

  toggleCollapsed = () => {
    this.setState({ collapsed: !this.state.collapsed });
  }

  render() {
    let content;
    if (this.state.error) {
      content = (<div>error</div>);
    } else {
      content = (
        <div>
          <img className="ui centered bordered image"
               src={`/processed-images/${this.state.filename}`}/>
          <AddReceiptItemsForm update={this.updateItems} items={this.state.items}/>
          <button type="submit"
            className={`ui massive fluid primary toggle button ${this.state.submitted ? 'active disabled' : ''}`}
            onClick={this.submitItems}>
            {this.state.submitted ? <span><i className="checkmark icon"></i>Success</span> : 'Submit'}
          </button>
        </div>
      );
    }

    return (
      <div className="verifier-wrapper">
        { content }
      </div>
    );
  }
}

export default Verifier;
