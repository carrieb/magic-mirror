import React from 'react';

import { tr } from 'util/translation-util';

import _groupBy from 'lodash/groupBy';
import _kebabCase from 'lodash/kebabCase';

import 'sass/shared/zones.scss';

function withZones(WrappedComponent, key='zone') {
  return class extends React.Component {
    render() {
      if (this.props.zone) {
        const {items, ...other} = this.props;
        const grouped = _groupBy(items, key);

        const sections = Object.keys(grouped).map((zone) => {
          const itemsForZone = grouped[zone];
          const name = zone === 'undefined' ? 'other' : zone;

          return (
            <div key={name}>
              <div className="ui block header zone-header" style={{ textTransform: 'capitalize' }}>
                <img className="ui small image" src={`/images/kitchen/${_kebabCase(name)}.png`}/>
                { tr(`ingredients.zones.${name.toLowerCase()}`) }
              </div>
              <WrappedComponent items={itemsForZone} {...other}/>
            </div>
          );
        });

        return <div>{ sections }</div>;
      } else {
        return <WrappedComponent {...this.props}/>
      }
    }
  }
}

export { withZones };
