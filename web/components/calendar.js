import React from 'react';

import ApiWrapper from '../util/api-wrapper';

import moment from 'moment';

import _groupBy from 'lodash/groupBy';
import _flatten from 'lodash/flatten';
import uniqueId from 'lodash/uniqueId';

import HorizontalList from 'components/common/horizontal-list.react';

import 'styles/mirror/calendar.css';

const Calendar = React.createClass({
  componentWillMount() {
    ApiWrapper.getCalendars((calendars) => {
      this.setState({ calendars });
    });
  },

  getInitialState() {
    return {
      calendars: []
    }
  },

  render() {
    const cals = this.state.calendars;
    const events = _flatten(cals.map((calendar) =>
      calendar.events.filter((ev) => ev != null)
    ));
    const grouped = _groupBy(events, (event) => {
      const start = moment(event.start.date || event.start.dateTime);
      const end = moment(event.end.date || event.end.dateTime);

      const isToday = start.isSame(moment(), 'day');
      const isTommorrow = start.isSame(moment().add(1, 'day'), 'day');

      if (isToday) { return 'Today' }
      else if (isTommorrow) { return 'Tomorrow' }
      else { return start.format('dddd') }
    });
    // TODO: sort both of these correctly (dates Today -> Tomorrow -> after) (events)
    const items = Object.keys(grouped).map((day) => {
      const title = day;
      const content = grouped[day].map((event) => {
        const start = moment(event.start.date || event.start.dateTime);
        const end = moment(event.end.date || event.end.dateTime);
        const allDay = (event.start && event.start.date) && (event.end && event.end.date);
        return <span key={uniqueId()}>{ allDay ? null : start.format('h:mm a') + ' '}{ event.summary }<br/></span>
      });
      return { title, content };
    });
    return (
      <div className="calendar">
        <HorizontalList items={items}/>
      </div>
    );
  }
});

export default Calendar;
