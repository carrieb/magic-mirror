import React from 'react';
import PropTypes from 'prop-types';

import RepeatableComponent from 'components/common/repeatable-component.react';

import { EMPTY_INGREDIENT } from 'state/RecipesState';

import 'sass/common/section-editor.scss';

import _uniqueId from 'lodash/uniqueId';
import _cloneDeep from 'lodash/cloneDeep';
import _find from 'lodash/find';
import _isEmpty from 'lodash/isEmpty';

class Section extends React.Component {
  updateValues = (i, value) => {
    const section = this.props.section;
    section[this.props.valuesKey][i] = value;
    this.props.updateSection(section);
  }

  addValue = () => {
    const section = this.props.section;
    const values = section[this.props.valuesKey] || [];
    const value = { id: _uniqueId() }; // todo: put default?
    values.push(value);
    section[this.props.valuesKey] = values;
    //console.log('values', this.props.valuesKey, values, section);
    this.props.updateSection(section);
  }

  deleteValue = (idx) => {
    console.log(idx);
    const section = this.props.section;
    const values = section[this.props.valuesKey];
    const filtered = values.filter((value, i) => i !== idx);
    console.log('orig:', values, 'filtered:', filtered, 'idx:', idx);
    section[this.props.valuesKey] = filtered;
    this.props.updateSection(section);
  }

  updateName = (ev) => {
    const section = this.props.section;
    section.name = ev.target.value;
    this.props.updateSection(section);
  }

  render() {
    //console.log('section', this.props);
    const section = this.props.section || {};
    const values = section[this.props.valuesKey] || [];

    const nameInput = <div>
      <div className="field">
        <label>{ _isEmpty(section.name) && <i className="red exclamation triangle icon"/> } Section Name</label>
        <input type="text" value={section.name} onChange={ this.updateName }/>
      </div>
    </div>;

    const repeated = <RepeatableComponent component={this.props.component}
                                          values={values}
                                          onChange={ this.updateValues }
                                          onAdd={ this.addValue }
                                          onRemove={ this.deleteValue }
                                          emptyText={this.props.emptyText}
                                          addText="Add Ingredient">
        { this.props.totalSections > 1 && nameInput }
        <button type="button"
                className="ui fluid basic mini red button remove-button"
                onClick={this.props.deleteSection}>Remove Section</button>
    </RepeatableComponent>

    //console.log(section);

    return (
      <div className="ui vertical segment section">
        { repeated }
      </div>
    );
  }
}

Section.propTypes = {
  component: PropTypes.func.isRequired,
  totalSections: PropTypes.number.isRequired,
  deleteSection: PropTypes.func.isRequired
}

class SectionedEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedSection: null
    }
  }

  setSelectedSection = (selectedSection) => {
    return () => {
      this.setState({ selectedSection })
    }
  };

  addSection = (ev) => {
    const sections = this.props.sections;
    const section = { id: _uniqueId() };
    section[this.props.valuesKey] = [];
    sections.push(section);
    this.props.updateSections(sections);
    ev.preventDefault();
  }

  deleteSection = (i) => {
    return () => {
      const sections = this.props.sections;
      const filtered = sections.filter((section, idx) => i !== idx);
      this.props.updateSections(filtered);
    }
  }

  updateSection = (i) => {
    return (section) => {
      console.log(i, section);
      const sections = this.props.sections;
      sections[i] = section;
      this.props.updateSections(sections);
    }
  }

  render() {
    const sections = this.props.sections || [];
    // console.log(sections, this.state.selectedSection);

    let currentSection = this.state.selectedSection;
    if (!this.state.selectedSection) {
      currentSection = sections.length === 0 ? null : sections[0];
    }

    // console.log(currentSection);

    const sectionMenuEls = sections.map((section, idx) =>
      <a key={idx}
         className={`ui ${section.name === currentSection.name ? 'active' : ''} item`}
         onClick={this.setSelectedSection(section)}>
        { section.name || 'default' }
      </a>
    );
    const idx = sections.indexOf(currentSection);

    const currentSectionDetails = <Section section={currentSection}
                                           emptyText={this.props.emptyText}
                                           component={this.props.component}
                                           valuesKey={this.props.valuesKey}
                                           totalSections={sections.length}
                                           key={currentSection.id || '?'}
                                           updateSection={ this.updateSection(idx) }
                                           deleteSection={ this.deleteSection(idx) }/>;

    const content = (
      <div className="ui grid">
        <div className="four wide column">
          <div className="ui violet secondary vertical fluid pointing menu select-section-menu">
            { sectionMenuEls }
          </div>
          <button type="button" className="ui fluid basic button" onClick={this.addSection}>Add Section</button>
        </div>
        <div className="twelve wide column">
          { currentSectionDetails }
        </div>
      </div>
    );

    return (
      <div className="sections-editor">
        { this.props.children }
        { content }
      </div>
    );
  }
}

SectionedEditor.propTypes = {
  sections: PropTypes.array,
  component: PropTypes.func.isRequired,
  updateSections: PropTypes.func.isRequired,
  emptyText: PropTypes.string
}

SectionedEditor.defaultProps = {
  sections: [],
  emptyText: 'No items in section.'
}

export default SectionedEditor;
