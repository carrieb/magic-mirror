import React from 'react';

import ApiWrapper from '../../util/api-wrapper';
import ItemInputs from './item-inputs';

import AddItemsForm from '../kitchen/AddItemsForm.react';

import KitchenState from 'state/KitchenState';

import 'sass/receipts/verifier.scss';

import _assign from 'lodash/assign';
import _clone from 'lodash/clone';

class Verifier extends React.Component {
  constructor(props) {
    super(props);
    this.submitItems = this.submitItems.bind(this);
    this.toggleCollapsed = this.toggleCollapsed.bind(this);
    this.updateItems = this.updateItems.bind(this);

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
            const def = _clone(KitchenState.DEFAULT_ITEM);
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

  submitItems(ev) {
    ApiWrapper.submitItems(this.state.items)
      .done(() => {
        this.setState({ submitted: true });
      });
    ev.preventDefault();
  }

  updateItems(items) {
    this.setState({ items });
  }

  toggleCollapsed() {
    this.setState({ collapsed: !this.state.collapsed });
  }

  render() {
    let itemInputs = [];

    this.state.items.forEach((item, index) => {
      const updateAtIndex = (field) => {
        return (ev) => {
          console.log(ev.target.value);
          this.state.items[index][field] = ev.target.value;
          //console.log(this.state.items);
          this.setState({ items: this.state.items });
        }
      };
      let extraContent;
      if (!this.state.collapsed) {
        extraContent = 'Extra content';
      }
      itemInputs.push(
        <ItemInputs key={index} item={item} onChange={updateAtIndex}/>
      );
      if (index !== this.state.items.length - 1) {
        itemInputs.push(<div key={`divider-${index}`} className="ui hidden divider"></div>)
      }
    });

    let content;
    if (this.state.error) {
      content = (<div>error</div>);
    } else {
      content = (
        <div>
          <img className="ui centered bordered image"
               src={`/processed-images/${this.state.filename}`}/>
          <AddItemsForm update={this.updateItems} items={this.state.items}/>
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
