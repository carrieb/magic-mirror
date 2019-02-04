import React from 'react';
import PropTypes from 'prop-types';

import RecipeParser from 'src/recipe-parser';

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
    const stepInput = <div className="ui fluid field">
      <label>{ this.props.index + 1 }.</label>
      <textarea rows="3"
             key={step._id}
             value={ step.content }
             onChange={ this.updateContent }/>
    </div>;

    //console.log(step);
    const dependenciesInput = <div className="ui fluid field">
      <label>Depends on:</label>
      <input type="text" value={ step.dependencies ? step.dependencies.join(', ') : '' }
             onChange={ this.updateDependencies }/>
    </div>;

    return (
      <div className="step" style={{ width: '100%' }}>
        { stepInput }
        { dependenciesInput }
      </div>
    );
  }
}

class DirectionsEditor extends React.Component {
  state = {
    showTextEditor: false
  }

  toggleShowTextEditor = () => {
    this.setState({ showTextEditor: !this.state.showTextEditor });
  }

  render() {
    let content;
    const text = RecipeParser.directionsToText(this.props.directions);
    const toggleButton = (
      <button className="ui fluid basic button"
              onClick={this.toggleShowTextEditor}>
              { this.state.showTextEditor ? 'Switch to Inputs' : 'Switch to Text' }
      </button>
    );

    if (this.state.showTextEditor) {
      content = (
        <div>
          <h4 className="ui header">Directions</h4>;
          { toggleButton }
          <textarea value={text}/>
        </div>
      );
    } else {
      content = <SectionedEditor component={Step}
                       valuesKey="steps"
                       title="Directions"
                       emptyText="No steps."
                       updateSections={this.props.updateDirections}
                       sections={this.props.directions}>
           { toggleButton }
       </SectionedEditor>;
    }
    return (
      <div className="directions-editor">
        { content }
      </div>
    );
  }
}

DirectionsEditor.propTypes = {
  directions: PropTypes.array.isRequired,
  updateDirections: PropTypes.func.isRequired
};

export default DirectionsEditor;
