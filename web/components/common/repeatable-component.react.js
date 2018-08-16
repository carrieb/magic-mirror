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
    const components = this.props.values.map((value, index) => {
      // TODO: pass in an onChange prop
      // console.log(this.props.values);
      const comp = React.createElement(this.props.component, {
        value,
        index,
        onChange: (updated) => {
          this.props.onChange(index, updated);
        }
      });

      return (
        <div key={value.id} className="inner-component">
          { comp }
          { this.props.values.length > 1 &&
              <div className="delete-button"><button className="ui circular icon button"
                    type="button"
                    onClick={() => this.remove(index)}><i className="trash icon"></i></button></div> }
        </div>
      );
    });

    return (
      <div className="repeated-component">
        { this.props.showRemoveSelf && <div className="ui top attached teal icon button" onClick={ this.props.onRemoveSelf }>
          <i className="minus icon"></i>
          { this.props.removeSelfText }
        </div> }
        <div className="ui attached segment">
          { this.props.children }
          { components }
        </div>
        <div className="ui bottom attached violet icon button" onClick={() => this.add()}>
          <i className="plus icon"></i>
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
