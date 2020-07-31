/**
 * Firebae Cloud functions
 * @author mtownsend
 * @since July 2020
 * @flow
 */

const functions = require('firebase-functions');
const admin =  require('firebase-admin');
admin.initializeApp();


const buildNotification = data => {
  switch (data.status) {
  case 'DRAFT':
    return {
      title: 'Voting has ended',
      body: `Read page ${data.canonLength} now!`
    };
  case 'VOTE':
    return {
      title: 'Voting is open',
      body: `Time to vote on page ${data.canonLength + 1}!`
    };
  }
  return null;
};

/**
 * Triggers when a narrative switches state.
 * Sends notifications to everyone who hasn't unsubscribed
 */
exports.sendStateNotifications = functions.firestore.document('/narrative/{narrativeId}')
  .onWrite(async change => {
    const notification = buildNotification(change.after.data());
    return notification && await admin.messaging().send({
      notification,
      webpush: {
        fcm_options: {
          link: 'https://thenarrative.doublespeakgames.com'
        }
      },
      condition: "!('unsub' in topics)"
    });
  });
