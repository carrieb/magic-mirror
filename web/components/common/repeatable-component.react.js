import React from 'react';
import PropTypes from 'prop-types';

import _range from 'lodash/range';
import _uniqueId from 'lodash/uniqueId';

class RepeatableComponent extends React.Component {
  constructor(props) {
    super(props);

    const components = this.props.values.map(_uniqueId);

    this.state = {
      components
    }
  }

  add() {
    const components = this.state.components;
    components.push(_uniqueId());
    this.setState({ components });
    this.props.onAdd();
  }

  remove(idx) {
    const components = this.state.components.filter((id, index) => index === idx);
    this.setState({ components });
    this.props.onRemove(idx);
  }

  render() {
    const components = this.state.components.map((id, index) => {
      // TODO: pass in an onChange prop
      // console.log(this.props.values);
      const comp = React.createElement(this.props.component, {
        value: this.props.values[index],
        index,
        onChange: (updated) => {
          this.props.onChange(index, updated);
        }
      });

      return (
        <div key={id} className="inner-component">

          { comp }
          { this.state.components.length > 1 &&
              <div className="delete-button"><button className="ui circular icon button"
                    type="button"
                    onClick={() => this.remove(index)}><i className="trash icon"></i></button></div> }
        </div>
      );
    });

    return (
      <div className="repeated-component">
        { this.props.children }
        <div className="ui attached segment">{ components }</div>
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
