import React from 'react';

import { getCurrentWeek } from 'util/moment-util';

import _capitalize from 'lodash/capitalize';

const WeekSegment = ({ day, color }) => {
  return (
    <div className={`ui inverted segment`}>
      <h4 className={`ui ${color} header`}>{ _capitalize(day) }</h4>
    </div>
  );
};

class CombinedVerticalCalendar extends React.Component {
  render() {
    const week = getCurrentWeek();
    const colors = ['red', 'orange', 'yellow', 'olive', 'green', 'blue', 'violet']
    const weekSegments = week.map((day, i) => <WeekSegment day={day} key={day} color={colors[i]}/>);
    return (
      <div className="combined-vertical-calendar">
        <div className="ui inverted segments">
          { weekSegments }
        </div>
      </div>
    );
  }
}

export default CombinedVerticalCalendar;
