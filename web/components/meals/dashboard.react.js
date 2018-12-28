import React from 'react';
import moment from 'moment';

import { img } from 'util/localization-util';
import { tr } from 'util/translation-util';

import 'sass/meals/dashboard.scss';

const DayColumn = (props) => {
  const isCurrent = moment().format('dddd') === props.day; // TODO: this is cheap logic

  const meals = ['breakfast', 'lunch', 'dinner'];

  const mealCards = meals.map(meal => <div className="ui card" key={meal}>
    <div className="content">
      <h4 className="ui header meal-title">
        <img className="ui mini image" src={ `/images/meals/${img(`meals.${meal}`)}` }/>
        <div className="content">{ tr(`meals.names.${meal}`) }</div>
      </h4>
      <button className="ui mini button">Plan</button>
    </div>
  </div>);

  return (
    <div className="column">
      <div className={`day-header ${isCurrent ? 'current' : ''}`}>{ tr(`calendar.days.${props.day}`) }</div>
      { mealCards }
    </div>
  );
};

class ThisWeekCalendar extends React.Component {
  render() {
    const start = moment().subtract(2, 'days');
    const end = moment().add(2, 'days');

    const now = moment();
    const temp = start.clone();

    const days = [];

    while (temp.isBefore(end)) {
      const dayText = temp.format('dddd');
      days.push(<DayColumn key={dayText} day={dayText}/>);
      temp.add(1, 'days');
    }

    return (
      <div className="this-week-calendar">
        <div className="ui divided five column grid">
          { days }
        </div>
      </div>
    );
  }
}

class MealsDashboard extends React.Component {
  render() {
    return (
      <div className="meals-dashboard">
        <ThisWeekCalendar/>
      </div>
    );
  }
}

export default MealsDashboard;
