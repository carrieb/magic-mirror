import React from 'react';
import PropTypes from 'prop-types';

import RepeatableComponent from 'components/common/repeatable-component.react';

import { EMPTY_INGREDIENT } from 'state/RecipesState';

import 'sass/recipes/ingredients-editor.scss';

import _uniqueId from 'lodash/uniqueId';
import _cloneDeep from 'lodash/cloneDeep';

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
    const section = this.props.section;
    const values = section[this.props.valuesKey];
    const filtered = values.filter((value, i) => i === idx);
    //console.log(steps, filtered, idx);
    section.values = filtered;
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
                                          showRemoveSelf={ this.props.totalSections > 1 }
                                          onChange={ this.updateValues }
                                          onAdd={ this.addValue }
                                          onRemoveSelf={ this.props.deleteSection }
                                          onRemove={ this.deleteValue }
                                          emptyText={this.props.emptyText}
                                          removeSelfText="Remove Section">
        { this.props.totalSections > 1 && nameInput }
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
    this.state = { collapsed: false }
  }

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
      const sections = this.props.sections;
      sections[i] = section;
      this.props.updateSections(sections);
    }
  }

  render() {
    const sections = this.props.sections || [];
    const moreThanOneSection = sections.length > 1;

    //console.log(sections);
    const sectionEls = sections.map((section, idx) => {

      return <Section section={section}
                      emptyText={this.props.emptyText}
                      component={this.props.component}
                      valuesKey={this.props.valuesKey}
                      totalSections={sections.length}
                      key={section.id}
                      updateSection={ this.updateSection(idx) }
                      deleteSection={ this.deleteSection(idx) }/>
    });

    let content = (
      <div>
        <div>{ sectionEls }</div>
        <button type="button"
          className="ui olive mini fluid button add-ingredient-button"
          onClick={this.addSection}>
            ADD SECTION
        </button>
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
        { !this.state.collapsed && content }
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
