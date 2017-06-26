import React from 'react';

import ApiWrapper from '../../util/api-wrapper';
import ItemInputs from './item-inputs';

import AddItemsForm from '../kitchen/AddItemsForm.react';

const Verifier = React.createClass({
  componentWillMount() {
    const filename = this.props.params.filename;
    if (filename) {
      ApiWrapper.extractText(this.props.params.filename, (items) => {
        this.setState({ items, loaded: true });
      }, () => {
        this.setState({ error: true });
      });
    }
  },

  getInitialState() {
    return {
      items: [],
      loaded: false,
      submitted: false,
      collapsed: true,
      error: false
    };
  },

  submitItems(ev) {
    // TODO: .. upload these to my db ..
    console.log(this.state.items);
    ApiWrapper.submitItems(this.state.items, () => { this.setState({ submitted: true }); });
    ev.preventDefault();
  },

  toggleCollapsed() {
    this.setState({ collapsed: !this.state.collapsed });
  },

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
          <img className="ui bordered image" src={`/processed-images/${this.props.params.filename}`}/>
          <form className="ui form">
            { itemInputs }
            <AddItemsForm />
            <button type="submit"
              className={`ui massive fluid primary toggle button ${this.state.submitted ? 'active disabled' : ''}`}
              onClick={this.submitItems}>
              {this.state.submitted ? <span><i className="checkmark icon"></i>Success</span> : 'Submit'}
            </button>
          </form>
        </div>
      );
    }
    return (
      <div className="verifier-wrapper">
        { content }
      </div>
    );
  }
});

export default Verifier;
