import React from 'react';
import { withRouter, Route, Switch, Redirect } from 'react-router';

import ApiWrapper from 'util/api-wrapper';

import MealTabs from 'components/meals/meal-tabs.react';
import MealRecipesList from 'components/meals/meal-recipes-list.react';
import MealSchedule from 'components/meals/meal-schedule.react';
import MealShoppingList from 'components/meals/meal-shopping-list.react';

import { tr } from 'util/translation-util';

import 'sass/meals/meal-overview.scss';

class MealOverview extends React.Component {
  state = {
    meal: null
  }

  componentWillMount() {
    const id = this.props.match.params.id;
    if (id) {
      ApiWrapper.getMeal(id)
        .then((meal) => this.setState({ meal }));
    }
  }

  render() {
    let header = null;
    let recipesRender = () => null;
    if (this.state.meal) {
      header = (
        <div className="ui orange header">
          <img src={`/images/meals/meal/${this.state.meal.name.toLowerCase()}.png`}/>
          { tr(`meals.names.${this.state.meal.name}`) }
        </div>
      );
    }

    return (
      <div className="meal-overview">
        { header }
        <MealTabs/>
        <Switch>
          <Redirect to={`/meal/${this.props.match.params.id}/recipes`} exact from={`/meal/${this.props.match.params.id}`}/>
          <Route path={`/meal/${this.props.match.params.id}/recipes`} render={props => (
            <MealRecipesList ids={this.state.meal ? this.state.meal.recipes : []} {...props}/>
          )}/>
          <Route path={`/meal/${this.props.match.params.id}/schedule`} component={props => (
            <MealSchedule ids={this.state.meal ? this.state.meal.recipes: []} {...props}/>
          )}/>
          <Route path={`/meal/${this.props.match.params.id}/shopping`} render={props => (
            <MealShoppingList ids={this.state.meal ? this.state.meal.recipes : []} {...props}/>
          )}/>
        </Switch>
      </div>
    );
  }
}

export default withRouter(MealOverview);
