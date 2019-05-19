import React from 'react';

import { tr } from 'util/translation-util';
import { CategoryImage } from 'util/kitchen-util';

import _groupBy from 'lodash/groupBy';
import _kebabCase from 'lodash/kebabCase';

import 'sass/shared/categories.scss';

class CategorizedSection extends React.Component {
  state = {
    collapsed: true
  }

  toggleCollapsed = () => {
    this.setState({ collapsed: !this.state.collapsed });
  }

  render() {
    const image = <CategoryImage category={this.props.name} size="small"/>;
    if (this.state.collapsed) {
      return (
        <div>
          <div className="ui block header category-header" style={{ textTransform: 'capitalize' }}>
          <button className="ui right floated button" onClick={this.toggleCollapsed}>
            <i className="plus icon"/>
            { this.props.size } items
          </button>
            { image }
            { tr(`ingredients.categories.${ this.props.name.toLowerCase() }`) }
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <div className="ui block header category-header" style={{ textTransform: 'capitalize' }}>
            { image }
            { tr(`ingredients.categories.${ this.props.name.toLowerCase()}`) }
            <button className="ui right floated button" style={{ padding: '11px 11px' }}  onClick={this.toggleCollapsed}>
              <i className="minus icon" style={{ margin: 0 }}/>
            </button>
          </div>
          { this.props.children }
        </div>
      );
    }
  }
}

function withCategories(WrappedComponent, key='category') {
  return class extends React.Component {
    render() {
      if (this.props.categorize) {
        const {items, ...other} = this.props;
        const categorized = _groupBy(items, key);

        const sections = Object.keys(categorized).map((category) => {
          const itemsForCategory = categorized[category];
          const name = category === 'undefined' ? 'other' : category;

          return (
            <CategorizedSection key={name} size={itemsForCategory.length} name={name}>
              <WrappedComponent items={itemsForCategory} {...other}/>
            </CategorizedSection>
          );
        });

        return <div>{ sections }</div>;
      } else {
        const {items, ...other} = this.props;
        return <WrappedComponent items={items} {...other}/>
      }
    }
  }
}

export { withCategories };
