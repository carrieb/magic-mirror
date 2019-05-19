import React from 'react';
import PropTypes from 'prop-types';

import { withRecipes } from 'state/RecipesState';

class DeleteModal extends React.Component {
  componentDidMount() {
    $('.delete-modal')
      .modal({ detachable: false, transition: 'horizontal flip', onHidden: this.props.onCancel })
      .modal('show');
  }

  onSubmit = () => {
    // use recipe state method to delete recipe
    console.log(`i will delete ${this.props.recipe.name}`);
    this.props.deleteRecipe(this.props.recipe);
  }

  render() {
    //console.log(this.props.recipe);
    // TODO: investigate why this causes DOM exceptions on recipes-list
    // i assume i has something to do with slick... 
    return (
      <div className="ui mini modal delete-modal" style={{ position: 'fixed', top: '40%' }}>
        <div className="header">Are you sure you want to delete { this.props.recipe.name }?</div>
        <div className="actions">
          <div className="ui red deny button">
            No
          </div>
          <div className="ui positive right labeled icon button" onClick={ this.onSubmit }>
            Yes
            <i className="utensils icon"/>
          </div>
        </div>
    </div>
    );
  }
}

export default withRecipes(DeleteModal);
