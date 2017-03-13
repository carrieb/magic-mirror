// const firebase = require("firebase");
// const config = {
//   apiKey: "AIzaSyC3aNM9pJ86Zsd3AEmCHRFDRQ9wxZy49us",
//   authDomain: "magic-mirror-156519.firebaseapp.com",
//   databaseURL: "https://magic-mirror-156519.firebaseio.com",
//   storageBucket: "magic-mirror-156519.appspot.com",
//   messagingSenderId: "924090431349"
// };
// firebase.initializeApp(config);
//
// router.get('/firebase-auth', (req, res) => {
//
// });
//

// Send notifications
const RequestWrapper = require('../request-wrapper');

const Config = require('../config');
const PropertiesReader = require('properties-reader')
const properties = PropertiesReader(Config.getConfigDir() + 'firebase.properties')

// TODO:
// store iid (instance id) in db and subscribe to
// first batchRemove any current topics?
// then re-link?
// currently have desktop & phone linked to topics/expirations


const sendMessageToDevice = (deviceId) => {
  console.log('sending..');
  RequestWrapper.post('fcm.googleapis.com', '/fcm/send', {
    "to" : "/topics/expirations",
    "notification" : {
      "title": "Portugal vs. Denmark",
      "text": "5 to 1"
    }
  }, (response) => {
    console.log(response);
  }, (error) => {
    console.log(error);
  }, {
    'Content-Type': 'application/json',
    'Authorization': `key=${properties.get('server.key')}`
  });
};

const registerDevice = (deviceId, done, error) => {
  console.log(`registering '${deviceId}'...`);
  RequestWrapper.post(
    'iid.googleapis.com',
    `/iid/v1/${deviceId}/rel/topics/expirations`,
    {},
    done,
    error, {
      'Content-Type': 'application/json',
      'Authorization': `key=${properties.get('server.key')}`
    });
}

const unregisterDevices = (deviceIds, done, error) => {
  console.log(`unregistering ${deviceIds}...`);
  RequestWrapper.post(
    'iid.googleapis.com',
    '/iid/v1:batchRemove',
    {
      to: '/topics/expirations',
      registration_tokens: deviceIds
    },
    done,
    error, {
      'Content-Type': 'application/json',
      'Authorization': `key=${properties.get('server.key')}`
    }
  );
}

const unregisterDevice = (deviceId, done, error) => {
  unregisterDevices([deviceId], done, error);
}

const AlertsApi = {
  sendMessageToDevice,
  registerDevice,
  unregisterDevices,
  unregisterDevice
}

module.exports = AlertsApi;
