const fs = require('fs');
const readline = require('readline');
const google = require('googleapis');
const googleAuth = require('google-auth-library');
const moment = require('moment');
const find = require('lodash/find');

const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
const Config = require('../config');
const PropertiesReader = require('properties-reader');
const properties = PropertiesReader(Config.getConfigDir() + 'google.properties');

const clientSecret = properties.get('client.secret');
const clientId = properties.get('client.id');
const redirectUrl = 'http://localhost:3000/google-auth-callback';
const auth = new googleAuth();
const oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

const GoogleApi = {
  generateAuthUrl() {
    // TODO: check if we have a token
    return oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES
    });
  },

  getNewToken(code, callback) {
    oauth2Client.getToken(code, (err, token) => {
      if (err) {
        console.log('error when retrieving google access token')
        return;
      }
      // TODO: more intelligent saving of tokens.
      oauth2Client.credentials = token;
      callback();
    });
  },

  getCalendarList(callback, err) {
    const calendar = google.calendar('v3');
    calendar.calendarList.list({
      auth: oauth2Client,
      maxResults: 50
    }, (error, response) => {
      if (error) {
        console.log('The API returned an error: ' + error);
        err();
      }
      var cals = response.items;
      callback(cals);
    });
  },

  getEventsForCalendars(calendars, callback, err) {
    let result = [];
    calendars.forEach((cal) => {
      const calendar = google.calendar('v3');
      calendar.events.list({
        auth: oauth2Client,
        calendarId: cal.id,
        showDeleted: false,
        maxResults: 10,
        timeMin: moment().toISOString(),
        timeMax: moment().add(2, 'day').toISOString(),
        singleEvents: true
      }, (error, response) => {
        if (error) {
          console.log('error looking up events for ' + cal.id + ': ' + error);
          result.push(null);
          return;
        }
        let events = [];
        console.log(cal.id, response.items);
        if (response.items) {
          events = response.items.map((event) => {
            //console.log(event);
            if (event.status === 'cancelled') {
              return null;
            }
            const me = find(event.attendees, (attendee) => {
              console.log(attendee);
              return attendee.email === 'carolyn@indeed.com';
            });
            if (me && me.responseStatus === 'declined') {
              return null;
            }
            return {
              title: event.summary,
              kind: event.kind,
              location: event.location,
              start: event.start.dateTime || event.start.date,
              end: event.end.dateTime || event.end.date
            }
          });
        }

        result.push({
          id: cal.id,
          title: cal.summary,
          events
        });
        if (result.length === calendars.length) {
          console.log(result);
          callback(result);
        }
      });
    });
  },

  retrieveCalendarsAndEvents(callback, err) {
    //console.log('at start', callback, err);
    this.getCalendarList((calendars) => {
      //console.log('calendar list', callback);
      this.getEventsForCalendars(calendars, (calendarsWithEvents) => {
        //console.log('events', callback);
        callback(calendarsWithEvents);
      }, err);
    }, err);
  }
}

module.exports = GoogleApi;
