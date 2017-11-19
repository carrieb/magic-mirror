import React from 'react';
import PropTypes from 'prop-types';

import RepeatableComponent from 'components/common/repeatable-component.react';

import _noop from 'lodash/noop';
import _uniqueId from 'lodash/uniqueId';

import 'sass/recipes/directions-editor.scss';

class Step extends React.Component {
  constructor(props) {
    super(props);
    this.updateContent = this.updateContent.bind(this);
  }

  updateContent(ev) {
    const content = ev.target.value;
    const step = this.props.step;
    step.content = content;
    this.props.onChange(step);
  }

  render() {
    //console.log('step', this.props);
    const step = this.props.value || {};
    const stepInput = <div className="field">
      <label>{ this.props.index + 1 }.</label>
      <textarea rows="3"
             value={ step.content }
             onChange={ this.updateContent }/>
    </div>;
    return (
      <div className="step">
        { stepInput }
      </div>
    );
  }
}

class Section extends React.Component {
  constructor(props) {
    super(props);
    this.updateStep = this.updateStep.bind(this);
    this.addStep = this.addStep.bind(this);
    this.deleteStep = this.deleteStep.bind(this);
  }

  updateStep(i, step) {
    const section = this.props.section;
    section.steps[i] = step;
    this.props.updateSection(section);
  }

  addStep() {
    const section = this.props.section;
    const steps = section.steps || [];
    steps.push({});
    section.steps = steps;
    this.props.updateSection(section);
  }

  deleteStep(idx) {
    const section = this.props.section;
    const steps = section.steps;
    const filtered = steps.filter((step, i) => i === idx);
    //console.log(steps, filtered, idx);
    section.steps = filtered;
    this.props.updateSection(section);
  }

  render() {
    const steps = this.props.section.steps || [];
    const repeated = <RepeatableComponent component={Step}
                                          values={steps}
                                          onChange={ this.updateStep }
                                          onAdd={ this.addStep }
                                          onRemove={ this.deleteStep }>
                                          { this.props.children }</RepeatableComponent>
    return (
      <div className="ui vertical segment directions-section">
        { repeated }
      </div>
    );
  }
}

class DirectionsEditor extends React.Component {
  constructor(props) {
    super(props);
    this.addSection = this.addSection.bind(this);
    this.updateSection = this.updateSection.bind(this);
  }

  deleteSection(i) {
    return () => {
      const directions = this.props.directions;
      const filtered = directions.filter((section, idx) => i !== idx);
      this.props.updateDirections(filtered);
    }
  }

  addSection() {
    // TODO: add section
    const directions = this.props.directions;
    //console.log(directions);
    directions.push({ steps: [ {} ] });
    this.props.updateDirections(directions);
  }

  updateSection(i) {
    return (section) => {
      const directions = this.props.directions;
      directions[i] = section;
      this.props.updateDirections(directions);
    }
  }

  render() {
    const directions = this.props.directions;
    let directionsSections = directions.map((section, i) => {
      return (
        <div key={_uniqueId()}>
          <Section section={section} updateSection={ this.updateSection(i) }>
            { directions.length > 1 && <div className="ui top attached teal icon button" onClick={ this.deleteSection(i) }>
              <i className="minus icon"></i>
            </div> }
          </Section>
        </div>
      );
    });

    return (
      <div className="directions-editor">
        <h4>Directions</h4>
        { directionsSections }
        <div style={{ textAlign: 'center' }}>
          <button className="ui blue mini button"
                  type="button"
                  onClick={this.addSection}>
            ADD SECTION
          </button>
        </div>
      </div>
    );
  }
}

DirectionsEditor.propTypes = {
  directions: PropTypes.array.isRequired,
  updateDirections: PropTypes.func.isRequired
};

DirectionsEditor.defaultProps = {
  directions: [],
  updateDirections: _noop
};

export default DirectionsEditor;
