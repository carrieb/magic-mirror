import React from 'react';

import PlanningCalendar from 'components/meals/planning-calendar.react';

class MealSchedule extends React.Component {
  render() {
    return (
      <div className="meal-schedule">
        <PlanningCalendar/>
      </div>
    );
  }
}

export default MealSchedule;
