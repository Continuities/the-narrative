/**
 * Firebase-related service calls
 * @author mtownsend
 * @since July 2020
 * @flow
 */

import Firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
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

export const activePages = () => db.collection('active-pages');

export const signInOptions = [
  Firebase.auth.GoogleAuthProvider.PROVIDER_ID,
  Firebase.auth.EmailAuthProvider.PROVIDER_ID,
];

export const firebaseMultiEmitter = (refs:Array<$npm$firebase$firestore$CollectionReference>):() => Emitter<Array<?$npm$firebase$firestore$QuerySnapshot>> => {
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

export const firebaseEmitter =  (ref:$npm$firebase$firestore$CollectionReference):() => Emitter<$npm$firebase$firestore$QuerySnapshot> => {
  return asEmitter(emit => ref.onSnapshot(emit));
};

export const firebaseAuth = () => firebase.auth();
export const logout = () => firebase.auth().signOut();

export const authEmitter = ():() => Emitter<$npm$firebase$auth$User> => {
  const auth = emit => {
    firebase.auth().onAuthStateChanged(emit);
    return () => {};
  };
  return asEmitter(auth);
};
