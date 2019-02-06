import React from 'react';

import moment from 'moment-timezone';

import { getCurrentWeek } from 'util/moment-util';

import ApiWrapper from 'util/api-wrapper';

import _capitalize from 'lodash/capitalize';

const WeekSegment = ({ day, color, events }) => {
  const evEls = events.map((ev) => {
    const time = ev.start.date ? '' : moment(ev.start.dateTime).format('H:mm');
    return (
      <div key={ev.id}>
        { time && <b>{ time }</b> } { ev.summary }
      </div>
    );
  });

  return (
    <div className={`ui inverted segment`}>
      <h3 className={`ui ${color} header`}>{ _capitalize(day) }</h3>
      { evEls }
    </div>
  );
};

class CombinedVerticalCalendar extends React.Component {
  state = {
    events: []
  }

  componentWillMount() {
    ApiWrapper.getCalendars((events) => {
      this.setState({ events })
    });
  }

  render() {
    const weekDays = getCurrentWeek();
    const week = {};
    const colors = ['red', 'orange', 'yellow', 'olive', 'green', 'blue', 'violet'];

    weekDays.forEach((day) => {
      week[day] = [];
    });

    this.state.events.forEach((ev) => {
      const m = moment(ev.start.date || ev.start.dateTime);
      week[m.format('dddd').toLowerCase()].push(ev);
    });

    console.log(week);

    const weekSegments = weekDays.map((day, i) => <WeekSegment day={day} key={day} color={colors[i]} events={week[day]}/>);
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
