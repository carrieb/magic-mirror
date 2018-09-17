import React from 'react';
import PropTypes from 'prop-types';

import RepeatableComponent from 'components/common/repeatable-component.react';

import SectionedEditor from 'components/recipes/section-editor.react';

import _noop from 'lodash/noop';
import _uniqueId from 'lodash/uniqueId';

import 'sass/recipes/directions-editor.scss';

class Step extends React.Component {
  updateContent = (ev) => {
    const content = ev.target.value;
    const step = this.props.value;
    step.content = content;
    this.props.onChange(step);
  };

  updateDependencies = (ev) => {
    const content = ev.target.value;
    const step = this.props.value;
    step.dependencies = content.split(', ');
    this.props.onChange(step);
  };

  render() {
    //console.log('step', this.props);
    const step = this.props.value || {};
    const stepInput = <div className="field">
      <label>{ this.props.index + 1 }.</label>
      <textarea rows="3"
             key={step._id}
             value={ step.content }
             onChange={ this.updateContent }/>
    </div>;

    //console.log(step);
    const dependenciesInput = <div className="field">
      <label>Depends on:</label>
      <input type="text" value={ step.dependencies ? step.dependencies.join(', ') : '' }
             onChange={ this.updateDependencies }/>
    </div>;

    return (
      <div className="step">
        { stepInput }
        { dependenciesInput }
      </div>
    );
  }
}

class DirectionsEditor extends React.Component {
  render() {
    return (
      <div className="directions-editor">
        <SectionedEditor component={Step}
                         valuesKey="steps"
                         title="Directions"
                         emptyText="No steps."
                         updateSections={this.props.updateDirections}
                         sections={this.props.directions}/>
      </div>
    );
  }
}

DirectionsEditor.propTypes = {
  directions: PropTypes.array.isRequired,
  updateDirections: PropTypes.func.isRequired
};

export default DirectionsEditor;
