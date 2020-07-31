/**
 * Firebase-related service calls
 * @author mtownsend
 * @since July 2020
 * @flow
 */

import Firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/messaging';
import Config from '../config';
import { asEmitter } from '../util/emitter';

import type { Emitter } from '../util/emitter';

export type FirebaseWatcher<T> = {|
  addListener: (?T => void) => void,
  detach: () => void
|};

const firebaseConfig = {
  apiKey: Config.FIREBASE_KEY,
  authDomain: Config.FIREBASE_DOMAIN,
  databaseURL: Config.FIREBASE_DATABASE,
  projectId: Config.FIREBASE_PROJECT_ID,
  storageBucket: Config.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: Config.FIREBASE_SENDER_ID,
  appId: Config.FIREBASE_APP_ID,
  measurementId: Config.FIREBASE_MEASUREMENT_ID
};

const firebase = Firebase.initializeApp(firebaseConfig);
const db = Firebase.firestore();
const messaging = Firebase.messaging();

//$FlowFixMe: This is in Firebase 7
messaging.usePublicVapidKey(Config.FIREBASE_VAPID_KEY);
navigator.serviceWorker && navigator.serviceWorker.register('./static/firebase-message-sw.js').then(reg => {
  messaging.useServiceWorker(reg);
});

export const initNotifications = () => {
  messaging.getToken().then((currentToken) => {
    if (currentToken) {
      console.info('Got FCM token', currentToken);
    } else {
      console.info('No FCM token available. Request permission to generate one.');
    }
  }).catch((err) => {
    console.log('An error occurred while retrieving token. ', err);
  });
};

export const narrative = (narrativeId:string) => 
  db.collection('narrative').doc(narrativeId);
export const activeNarrative = () => db
  .collection('narrative')
  //$FlowFixMe: This is in Firebase 7
  .where('status', 'in', [ 'DRAFT', 'VOTE' ])
  .limit(1);

export const pages = (narrativeId:string) => db.collection(`narrative/${narrativeId}/pages`);
export const page = (narrativeId:string, pageId:string) => pages(narrativeId).doc(pageId);
export const canonPages = (narrativeId:string) => 
  pages(narrativeId)
    .where('isCanon', '==', true)
    .orderBy('number', 'asc');
export const draftPage = (authorUid:string, narrativeId:string, pageNumber:number) => 
  pages(narrativeId)
    .where('authorUid', '==', authorUid)
    .where('number', '==', pageNumber)
    .where('isCanon', '==', false)
    .limit(1);
export const toApprove = (narrativeId:string, pageNumber:number) =>
  pages(narrativeId)
    .where('isCanon', '==', false)
    .where('number', '==', pageNumber)
    .where('moderation', '==', 'PENDING');
export const toVote = (narrativeId:string, pageNumber:number) => 
  pages(narrativeId)
    .where('number', '==', pageNumber)
    // TODO: Support unmoderated setups?
    .where('moderation', '==', 'APPROVED')
    .where('isCanon', '==', false);

export const moderator = (authorUid:string) => 
  db.collection('moderators').doc(authorUid);

export const votes = (narrativeId:string) => 
  db.collection(`narrative/${narrativeId}/votes`);

export const signInOptions = [
  Firebase.auth.GoogleAuthProvider.PROVIDER_ID,
  Firebase.auth.EmailAuthProvider.PROVIDER_ID,
];

export const dbMultiEmitter = (refs:Array<$npm$firebase$firestore$Query>):() => Emitter<Array<?$npm$firebase$firestore$QuerySnapshot>> => {
  const firebase = emit => {
    let currentValues = new Array(refs.length);
    const destroy = refs.map((ref, index) =>
      ref.onSnapshot(snapshot => {
        currentValues[index] = snapshot;
        emit(currentValues);
      })
    );
    return () => {
      currentValues.length = 0;
      destroy.forEach(d => d());
    };
  };
  return asEmitter(firebase);
}

export const queryEmitter = (ref:$npm$firebase$firestore$Query):() => Emitter<$npm$firebase$firestore$QuerySnapshot> => {
  return asEmitter(emit => ref.onSnapshot(emit));
};

export const docEmitter = (ref:$npm$firebase$firestore$DocumentReference):() => Emitter<$npm$firebase$firestore$DocumentSnapshot> => {
  return asEmitter(emit => ref.onSnapshot(emit));
}

export const firebaseAuth = () => firebase.auth();
export const logout = () => firebase.auth().signOut();

export const authEmitter = ():() => Emitter<$npm$firebase$auth$User> => {
  const auth = emit => {
    firebase.auth().onAuthStateChanged(emit);
    return () => {};
  };
  return asEmitter(auth);
};
