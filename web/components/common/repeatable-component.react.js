import React from 'react';
import PropTypes from 'prop-types';

import _range from 'lodash/range';
import _uniqueId from 'lodash/uniqueId';

class RepeatableComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      components: [ _uniqueId() ]
    }
  }

  add() {
    const components = this.state.components;
    components.push(_uniqueId());
    this.setState({ components });
    this.props.onAdd();
  }

  remove(idx) {
    const components = this.state.components.filter((id, index) => index !== idx);
    this.setState({ components });
    this.props.onRemove(idx);
  }

  render() {
    const components = this.state.components.map((id, index) => {
      // TODO: pass in an onChange prop
      const comp = React.createElement(this.props.component, {
        index,
        onChange: (field, value) => {
          console.log(index, field, value);
          this.props.onChange(index, field, value);
        }
      });

      return (
        <div key={id}>
          <div className="ui grid">
            <div className={`ui ${this.state.components.length > 1 ? 'thirteen' : 'sixteen'} wide column`}>
              { comp }
            </div>
            { this.state.components.length > 1 &&
              <div className="ui three wide column">
                <button className="ui circular icon button"
                      type="button"
                      style={{ height: '100%', width: '100%' }}
                      onClick={() => this.remove(index)}><i className="trash icon"></i></button></div> }
          </div>
        </div>
      );
    });

    return (
      <div className="reapeated-component">
        <div className="ui top attached segment">{ components }</div>
        <div className="ui basic bottom attached icon button" type="button" onClick={() => this.add()}>
          <i className="plus icon"></i>
        </div>
      </div>
    );
  }
}

RepeatableComponent.propTypes = {
  component: PropTypes.func.isRequired,
  onChange: PropTypes.func,
  onAdd: PropTypes.func,
  onRemove: PropTypes.func
}

export default RepeatableComponent;
