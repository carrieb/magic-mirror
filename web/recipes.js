import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory, Link } from 'react-router';

import ApiRecipesList from 'components/recipes/ApiRecipesList.react';
import ApiAddRecipeForm from 'components/recipes/ApiAddRecipeForm.react';


class Recipes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showAddRecipeForm: false
    }
  }

  render() {
    return (
      <div className="ui container">
        <button className="ui fluid purple button"
                onClick={() => this.setState({ showAddRecipeForm: !this.state.showAddRecipeForm })}>
                Add Recipe
        </button>
        { this.state.showAddRecipeForm && <ApiAddRecipeForm/> }
        { !this.state.showAddRecipeForm && <ApiRecipesList/> }
      </div>
    );
  }
}

window.onload = function() {
  ReactDOM.render(
    <Router history={browserHistory}>
      <Route path="/recipes" component={Recipes}/>
    </Router>,
    document.getElementById("render-wrapper")
  );
}
