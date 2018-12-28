import React from 'react';

import { tr } from 'util/translation-util';

import _groupBy from 'lodash/groupBy';
import _kebabCase from 'lodash/kebabCase';

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
            <div key={name}>
              <div className="ui top attached block header category-header" style={{ textTransform: 'capitalize' }}>
                <img className="ui small image" src={`/images/kitchen/${_kebabCase(name)}.png`}/>
                { tr(`ingredients.categories.${name.toLowerCase()}`) }
              </div>
              <WrappedComponent items={itemsForCategory} {...other}/>
            </div>
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
