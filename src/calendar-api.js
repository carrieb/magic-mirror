const fs = require('fs');
const readline = require('readline');
const google = require('googleapis');
const googleAuth = require('google-auth-library');
const moment = require('moment');

const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
const PropertiesReader = require('properties-reader');
const properties = PropertiesReader('/Users/carolyn/projects/magic-mirror/config/google.properties');

const clientSecret = properties.get('client.secret');
const clientId = properties.get('client.id');
const redirectUrl = 'http://localhost:3000/google-auth-callback';
const auth = new googleAuth();
const oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

let calendars = [];

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

  retrieveCalendarsAndEvents() {
    var calendar = google.calendar('v3');
    calendar.calendarList.list({
      auth: oauth2Client,
      maxResults: 20
    }, function(err, response) {
      if (err) {
        console.log('The API returned an error: ' + err);
        return;
      }
      var cals = response.items;
      cals.forEach((cal) => {
        calendar.events.list({
          auth: oauth2Client,
          calendarId: cal.id,
          showDeleted: false,
          maxResults: 10,
          timeMin: moment().toISOString(),
          timeMax: moment().add(1, 'day').toISOString()
        }, (err, res) => {
          if (err) {
            console.log('error looking up events for ' + cal.id);
            calendars.push(null);
            return;
          }
          let events = res.items;
          if (events) {
            events = events.map((event) => {
              //console.log(event);
              if (event.status === 'cancelled') {
                return null;
              }
              return {
                title: event.summary,
                kind: event.kind,
                location: event.location,
                start: event.start.dateTime || event.start.date,
                end: event.end.dateTime || event.start.end
              }
            });
          }
          calendars.push({
            id: cal.id,
            title: cal.summary,
            events
          });
          if (calendars.length === cals.length) {
            console.log(calendars);
          }
        });
      });
    });
  }
}

module.exports = GoogleApi;
