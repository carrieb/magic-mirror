import React from 'react';
import PropTypes from 'prop-types';

import _range from 'lodash/range';
import _uniqueId from 'lodash/uniqueId';

class RepeatableComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  add() {
    this.props.onAdd();
  }

  remove(idx) {
    this.props.onRemove(idx);
  }

  render() {
    //console.log(this.props.values);
    const values = this.props.values;
    const components = values.map((value, index) => {
      const comp = React.createElement(this.props.component, {
        value,
        index,
        onChange: (updated) => {
          this.props.onChange(index, updated);
        }
      });

      //console.log(value.id, comp.type.name);

      return (
        <div key={value.id || _uniqueId() } className="inner-component">
          <div style={{ position: 'relative' }}>
            <div className="component-wrapper" style={{ width: 'calc(100% - 45px)', display: 'inline-block' }}>
              { comp }
            </div>
            <span className="delete-button-wrapper" >
              <button className="ui circular basic red icon button"
                      style={{ position: 'absolute', right: 0, bottom: 0 }}
                      onClick={() => this.remove(index)}>
                  <i className="trash icon"></i>
              </button>
            </span>
          </div>
        </div>
      );
    });

    return (
      <div className="repeated-component">
        <div>
          { this.props.children }
          { components }
          { values.length === 0 && <div className="ui negative message"><i className="exclamation circle icon"/>{ this.props.emptyText }</div> }
        </div>
        <div className="ui fluid basic violet icon button" onClick={() => this.add()} style={{ marginTop: '1rem' }}>
          <i className="plus icon"></i>
          { this.props.addText }
        </div>
      </div>
    );
  }
}

RepeatableComponent.propTypes = {
  component: PropTypes.func.isRequired,
  values: PropTypes.array.isRequired,
  onChange: PropTypes.func,
  onAdd: PropTypes.func,
  onRemove: PropTypes.func
};

RepeatableComponent.defaultProps = {
  values: []
};

export default RepeatableComponent;
