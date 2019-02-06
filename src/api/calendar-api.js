/* NEEDS TO BE UPDATED FOR API CHANGES */

const fs = require('fs');
const readline = require('readline');
const moment = require('moment');
const { google } = require('googleapis');

const config = require('../config');

const _sortBy = require('lodash/sortBy');
const _filter = require('lodash/filter');
const _find = require('lodash/find');
// const _filter = require('lodash/filter');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = config.getConfigDir() + 'token.json';

let auth = null;

let awaiting = [];

// Load client secrets from a local file.
fs.readFile(config.getConfigDir() + 'google-credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Google Calendar API.
  authorize(JSON.parse(content), (oauth) => {
    //console.log(oauth);
    auth = oauth;
    //console.log(awaiting);
    awaiting.forEach((cb) => {
      //console.log(cb);
      cb();
    });
  });
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getAccessToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

function authRequired(func) {
  return (...args) => {
    if (auth) {
      func(...args);
    } else {
      awaiting.push(func.bind(null, ...args));
    }
  }
}

/**
 * Lists the next 10 events on the user's primary calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function getEvents(calendarId='primary', cb) {
  const calendar = google.calendar({ version: 'v3', auth });

  calendar.events.list({
    calendarId,
    timeMin: moment().startOf('day').toISOString(),
    timeMax: moment().startOf('day').add(7, 'days').toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: 'startTime',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const events = res.data.items;
    cb(events);
  });
}

function getCalendars(cb) {
  const calendar = google.calendar({ version: 'v3', auth });

  calendar.calendarList.list((err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const calendars = res.data.items;
    cb(calendars);
  });
}

function getEventsForCalendars(cb, err) {
  getCalendars((calendars) => {
    let loaded = 0;
    const total = calendars.length;
    const allEvents = [];
    const done = (cb) => {
      if (loaded === total) {
        console.log('Done!');
        const filtered = _filter(allEvents, (ev) => {
          const declined = _find(ev.attendees, (attendee) =>
            (attendee.responseStatus === 'declined' || attendee.responseStatus === 'needsAction')
            && (attendee.email === 'carolyn@indeed.com' || attendee.email === 'cboland@indeed.com'));
          return !declined;
        });

        const sorted = _sortBy(filtered, [(ev) => {
          const m = moment(ev.start.date || ev.start.dateTime);
          return m.unix();
        }]);

        cb(sorted);
      }
    }

    calendars.forEach((cal) => {
      getEvents(cal.id, (events) => {
        events.forEach((ev) => {
          allEvents.push(ev);
        });
        loaded+=1;
        console.log(`Loaded ${loaded}/${total}`);
        done(cb);
      });
    });
  });
}

module.exports = {
  getCalendars: authRequired(getCalendars),

  getEvents: authRequired(getEvents),

  getEventsForCalendars: authRequired(getEventsForCalendars)
}
