import * as firebase from 'firebase';

import ApiWrapper from 'util/api-wrapper';

const firebaseConfig = {
  apiKey: "AIzaSyC3aNM9pJ86Zsd3AEmCHRFDRQ9wxZy49us",
  authDomain: "magic-mirror-156519.firebaseapp.com",
  databaseURL: "https://magic-mirror-156519.firebaseio.com",
  storageBucket: "magic-mirror-156519.appspot.com",
  messagingSenderId: "924090431349"
};

const sendTokenToServer = (token) => {
  ApiWrapper.submitFirebaseToken(token)
  .done((res) => {
    console.log('/firebase-token response', res);
    // TODO: update UI to indicate you've sent your info to the server to be subscribed to messages.
  })
  .fail((error) => {
    console.error('/firebase-token error', error);
  });
}

const MessagingUtil = {
  subscribeDevice() {
    firebase.initializeApp(firebaseConfig);

    const messaging = firebase.messaging();
    // TODO: Make them register with google, associate with email/user device?
    // Then, let them unsubscribe individual devices
    messaging.requestPermission()
      .then(() => {
        console.log('Notification permission granted.');
        // Get Instance ID token. Initially this makes a network call, once retrieved
        // subsequent calls to getToken will return from cache.
        messaging.getToken()
          .then((currentToken) => {
            if (currentToken) {
              console.log('Firebase token retrieved:', currentToken);
              sendTokenToServer(currentToken);
            } else {
              console.log('No Instance ID token available. Request permission to generate one.');
            }
          })
          .catch(function(err) {
            console.log('An error occurred while retrieving firebase IID messaging token. ', err);
          });

      // Callback fired if Instance ID token is updated.
      messaging.onTokenRefresh(() => {
        messaging.getToken()
          .then(function(refreshedToken) {
            console.log(refreshedToken);
            console.log('Token refreshed.');
            sendTokenToServer(refreshedToken);
          })
          .catch(function(err) {
            console.log('Unable to retrieve refreshed token ', err);
          });
      });

      messaging.onMessage((payload) => {
        console.log("Message received. ", payload);
        // TODO: display notification
      });
    })
    .catch(function(err) {
      console.log('Unable to request permission to notify.', err);
    });
  }
}

export default MessagingUtil;
