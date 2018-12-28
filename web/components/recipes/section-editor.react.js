import React from 'react';
import PropTypes from 'prop-types';

import RepeatableComponent from 'components/common/repeatable-component.react';

import { EMPTY_INGREDIENT } from 'state/RecipesState';

import 'sass/recipes/ingredients-editor.scss';

import _uniqueId from 'lodash/uniqueId';
import _cloneDeep from 'lodash/cloneDeep';
import _find from 'lodash/find';

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

    const nameInput = <div className="field">
      <label>Section Name</label>
      <input type="text" value={section.name} onChange={ this.updateName }/>
    </div>;

    const repeated = <RepeatableComponent component={this.props.component}
                                          values={values}
                                          onChange={ this.updateValues }
                                          onAdd={ this.addValue }
                                          onRemove={ this.deleteValue }
                                          emptyText={this.props.emptyText}
                                          addText="Add Ingredient">
        { this.props.totalSections > 1 && nameInput }
    </RepeatableComponent>

    //console.log(section);

    return (
      <div className="ui vertical segment section">
        { repeated }
        { this.props.totalSections > 1 &&
          <button className="ui fluid basic red button">Remove Section</button> }
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
      collapsed: false,
      selectedSection: null
    }
  }

  setSelectedSection = (selectedSection) => {
    return () => {
      this.setState({ selectedSection })
    }
  };

  toggleCollapsed = () => {
    this.setState({ collapsed: !this.state.collapsed });
  };

  addSection = () => {
    const sections = this.props.sections;
    const section = { id: _uniqueId() };
    section[this.props.valuesKey] = [];
    sections.push(section);
    this.props.updateSections(sections);
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

    let currentSection = null;
    if (this.state.selectedSection) {
      currentSection = _find(sections, (s) => s.name === this.state.selectedSection);
    } else {
      currentSection = sections.length === 0 ? null : sections[0];
    }

    const sectionMenuEls = sections.map((section, idx) =>
      <a key={idx}
         className={`ui ${currentSection.name === section.name ? 'active' : ''} item`}
         onClick={this.setSelectedSection(section.name)}>
        { section.name }
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

    const newContent = (
      <div className="ui grid">
        <div className="four wide column">
          <div className="ui violet secondary vertical fluid pointing menu select-section-menu">
            { sectionMenuEls }
          </div>
        </div>
        <div className="twelve wide column">
          { currentSectionDetails }
        </div>
      </div>
    );

    const caret = this.state.collapsed ? 'edit' : 'check';
    const text = this.state.collapsed ? 'Edit' : 'Done';
    const icon = <span style={{ float: 'right', margin: '0' }} onClick={this.toggleCollapsed}>
      <i className={`${caret} icon`}/>
      { text }
    </span>
    return (
      <div className="sections-editor">
        <h4>{ icon }{ this.props.title }</h4>
        { !this.state.collapsed && newContent }
      </div>
    );
  }
}

SectionedEditor.propTypes = {
  sections: PropTypes.array,
  component: PropTypes.func.isRequired,
  title: PropTypes.string,
  updateSections: PropTypes.func.isRequired,
  emptyText: PropTypes.string
}

SectionedEditor.defaultProps = {
  sections: [],
  title: 'Default Title',
  emptyText: 'No items in section.'
}

export default SectionedEditor;
