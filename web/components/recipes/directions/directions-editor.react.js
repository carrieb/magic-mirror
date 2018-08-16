import React from 'react';
import PropTypes from 'prop-types';

import RepeatableComponent from 'components/common/repeatable-component.react';

import _noop from 'lodash/noop';
import _uniqueId from 'lodash/uniqueId';

import 'sass/recipes/directions-editor.scss';

class Step extends React.Component {
  updateContent = (ev) => {
    const content = ev.target.value;
    const step = this.props.step;
    step.content = content;
    this.props.onChange(step);
  };

  updateDependencies = (ev) => {
    const content = ev.target.value;
    const step = this.props.step;
    step.dependencies = content.split(', ');
    this.props.onChange(step);
  };

  render() {
    //console.log('step', this.props);
    const step = this.props.value || {};
    const stepInput = <div className="field">
      <label>{ this.props.index + 1 }.</label>
      <textarea rows="3"
             value={ step.content }
             onChange={ this.updateContent }/>
    </div>;

    console.log(step);
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
    steps.push({ key: _uniqueId() });
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

  updateName(ev) {
    const section = this.props.section;
    section.name = ev.target.value;
    this.props.updateSection(section);
  }

  render() {
    const section = this.props.section || {};
    const steps = section.steps || [];
    const nameInput = <div className="field">
      <label>Section Name</label>
      <input type="text" value={section.name} onChange={ this.updateName }/>
    </div>;
    const repeated = <RepeatableComponent component={Step}
                                          values={steps}
                                          onChange={ this.updateStep }
                                          onAdd={ this.addStep }
                                          showRemoveSelf={ this.props.totalSections > 1 }
                                          onRemoveSelf={ this.props.deleteSection }
                                          onRemove={ this.deleteStep }
                                          removeSelfText="Remove Section">
                                          { this.props.totalSections > 1 && nameInput }
    </RepeatableComponent>
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

    this.state = {
      collapsed: true
    }
  }

  toggleCollapsed = () => {
    this.setState({ collapsed: !this.state.collapsed });
  };

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
    directions.push({ id: _uniqueId(), steps: [ { id: _uniqueId() } ] });
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
          <Section section={section} updateSection={ this.updateSection(i) } deleteSection={ this.deleteSection(i) }/>
        </div>
      );
    });

    const content = <div>
      { directionsSections }
      <div style={{ textAlign: 'center' }}>
        <button className="ui fluid blue mini button"
                type="button"
                onClick={this.addSection}>
          ADD SECTION
        </button>
      </div>
    </div>

    const caret = this.state.collapsed ? 'edit' : 'check';
    const text = this.state.collapsed ? 'Edit' : 'Done';
    const icon = <span style={{ float: 'right', margin: '0' }} onClick={() => this.toggleCollapsed()}>
      <i className={`${caret} icon`}/>
      { text }
    </span>
    return (
      <div className="directions-editor">
        <h4>{icon}Directions</h4>
        { !this.state.collapsed && content }
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
