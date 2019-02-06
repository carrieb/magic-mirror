const CalendarApi = require('../src/api/calendar-api');

CalendarApi.getEventsForCalendars(
  (events) => { console.log('events', events.length); },
  (err) => { console.log('error', err) }
);
