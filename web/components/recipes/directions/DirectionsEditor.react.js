import React from 'react';

class DirectionsEditor extends React.Component {
  constructor(props) {
    super(props);
    this.addSection = this.addSection.bind(this);
  }

  addSection() {
    // TODO: add section
  }

  render() {
    let directionsSections = null;
    return (
      <div className="directions-editor">
        <label>Directions</label>
        { directionsSections }
        <button className="ui basic blue mini fluid button"
                type="button"
                onClick={this.addSection}>
          Add Directions Section
        </button>
      </div>
    );
  }
}

DirectionsEditor.propTypes = {
  directions: React.PropTypes.array.isRequired,
};

DirectionsEditor.defaultProps = {
  directions: []
};

export default DirectionsEditor;
