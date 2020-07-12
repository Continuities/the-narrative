/**
 * Firebase-related service calls
 * @author mtownsend
 * @since July 2020
 * @flow
 */

import Firebase from 'firebase/app';
import 'firebase/auth';
// import 'firebase/database';
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

// export const device = (oemId:string, instanceId:string) => firebase.database().ref(`devices/oems/${oemId}/iot/${instanceId}`);
// export const devices = (oemId:string) => firebase.database().ref(`devices/oems/${oemId}/iot/`);
// export const oems = (oemId?:string) => {
//   if (oemId) {
//     return firebase.database().ref(`oem/${oemId}`);
//   }
//   return firebase.database().ref('oem');
// };
// export const userInfo = (uid:string) => firebase.database().ref(`users/${uid}`);
// export const products = (oemId:string, productId?:string, modelId?:string, versionId?:string) => {
//   const path = [ 'products', oemId, productId, modelId, versionId ]
//     .filter(Boolean)
//     .join('/');
//   return firebase.database().ref(path);
// };
// export const demo = (demoId:string) => firebase.database().ref(`demo/${demoId}`);
// export const controller = (oemId:string, controllerId:string) => firebase.database().ref(`devices/oems/${oemId}/ctrl/${controllerId}`);

export const signInOptions = [
  Firebase.auth.GoogleAuthProvider.PROVIDER_ID,
  Firebase.auth.EmailAuthProvider.PROVIDER_ID,
];

export const firebaseMultiEmitter = (refs:Array<$npm$firebase$database$Reference>):() => Emitter<Array<?$npm$firebase$database$Value>> => {
  const firebase = emit => {
    let currentValues = new Array(refs.length);
    const destroy = refs.map((ref, index) => {
      const onValue = snapshot => {
        const val = snapshot.val();
        currentValues[index] = val;
        emit(currentValues);
      };
      ref.on('value', onValue);
      return () => { ref.off('value', onValue); };
    });
    return () => {
      currentValues.length = 0;
      destroy.forEach(d => d());
    };
  };
  return asEmitter(firebase);
}

export const firebaseEmitter =  (ref:$npm$firebase$database$Reference):() => Emitter<$npm$firebase$database$Value> => {
  const firebase = emit => {
    const onValue = snapshot => {
      emit(snapshot.val());
    };
    ref.on('value', onValue);
    return () => {
      ref.off('value', onValue);
    }
  };
  return asEmitter(firebase);
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
