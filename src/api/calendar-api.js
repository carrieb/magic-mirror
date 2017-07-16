const fs = require('fs');
const readline = require('readline');
const google = require('googleapis');
const googleAuth = require('google-auth-library');
const moment = require('moment');
const find = require('lodash/find');
const _filter = require('lodash/filter');

const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
const Config = require('../config');
const PropertiesReader = require('properties-reader');
const properties = PropertiesReader(Config.getConfigDir() + 'google.properties');

const clientSecret = properties.get('client.secret');
const clientId = properties.get('client.id');
const accessToken = properties.get('access.token');
const refreshToken = properties.get('refresh.token');
const redirectUrl = 'http://localhost:3000/google-auth-callback';
const auth = new googleAuth();
const oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

if (refreshToken && accessToken) {
  //console.log(refreshToken);
  oauth2Client.credentials.refresh_token = refreshToken;
  oauth2Client.credentials.access_token = accessToken;
  oauth2Client.refreshAccessToken((err, tokens) => {
    // your access_token is now refreshed and stored in oauth2Client
    // store these new tokens in a safe place (e.g. database)
    //properties.set('access.token', tokens.access_token);
    //properties.set('refresh.token', tokens.refresh_token);
    // TODO: more intelligent saving of tokens - above doesn't write file
    // store expiration and use to determine when to refresh
  });
}

const GoogleApi = {
  generateAuthUrl() {
    // TODO: check if we have a token
    return oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES
    });
  },

  getNewToken(code, callback) {
    oauth2Client.getToken(code, (err, tokens) => {
      if (err) {
        console.log('error when retrieving google access token')
        return;
      }

      //console.log(tokens.access_token, tokens.refresh_token);
      //properties.set('access.token', tokens.access_token);
      //properties.set('refresh.token', tokens.refresh_token);
      // TODO: more intelligent saving of tokens - above doesn't write file
      oauth2Client.credentials = tokens;
      callback();
    });
  },

  getCalendarList(callback, err) {
    console.log(oauth2Client.credentials)
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
        //console.log(cal.id, response.items);
        if (response.items) {
          events = response.items.map((event) => {
            //console.log(event);
            if (event.status === 'cancelled') {
              return null;
            }
            const me = find(event.attendees, (attendee) => {
              //console.log(attendee);
              return attendee.email === 'carolyn@indeed.com';
            });
            if (me && me.responseStatus === 'declined') {
              return null;
            }
            return event;
          });
        }

        result.push({
          id: cal.id,
          title: cal.summary,
          events
        });
        if (result.length === calendars.length) {
          //console.log(result);
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
        const result = _filter(calendarsWithEvents, (cal) => cal != null && cal.events.length > 0)
        callback(result);
      }, err);
    }, err);
  }
}

module.exports = GoogleApi;
