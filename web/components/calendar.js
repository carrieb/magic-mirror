import React from 'react';

import ApiWrapper from '../util/api-wrapper';

import uniqueId from 'lodash/uniqueId';

import moment from 'moment';
import groupBy from 'lodash/groupBy';

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
    const calendars = this.state.calendars.filter((calendar) => {
      return calendar !== null;
    }).map((calendar) => {
      let events = []
      if (calendar.events) {
        const filtered = calendar.events.filter((event) => {
          return event !== null;
        });
        const groupedEvents = groupBy(filtered, (event) => {
          const start = moment(event.start);
          const end = moment(event.end);
          const isToday = start.isSame(moment(), 'day');
          const isTommorrow = start.isSame(moment().add(1, 'day'), 'day');
          if (isToday) { return 'Today' }
          else if (isTommorrow) { return 'Tomorrow' }
          else { return start.format('dddd') }
        });
        //console.log('grouped', groupedEvents);
        events = Object.keys(groupedEvents).map((group) => {
          const evs = groupedEvents[group].map((event) => {
            //console.log(event.start, event.end);
            const start = moment(event.start);
            const end = moment(event.end);
            const timeInfo = event.end ? (<span>{ start.format('h:mm a') }</span>) : null;
            return (
              <div className="event" key={uniqueId('event')}>
                { event.title }<br/>
                { timeInfo }
              </div>
            )
          });
          return (
            <div className="event-group" key={uniqueId('event-group')}>
              <b>{ group }</b>
              { evs }
            </div>
          )
        });
      }
      if (events.length > 0) {
        return (
          <div className="calendar" key={uniqueId('calendar')}>
            <div className="title">{calendar.title}</div>
            {events}
          </div>
        );
      }
      return null;
    });
    return (
      <div className="calendars-wrapper">
        { calendars }
      </div>
    )
  }
});

export default Calendar;
