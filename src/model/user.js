/**
 * Model for interating with user collactions
 * @author mtownsend
 * @since July 2020
 * @flow
 */

import {
  authEmitter,
  moderator,
  docEmitter
} from '../service/firebase';
import { map, join, useEmitter } from '../util/emitter';

export const useIsModerator = () => 
  useEmitter(join<$npm$firebase$auth$User, boolean>(authEmitter(), auth => {
    if (!auth) {
      return null;
    }
    return map(docEmitter(moderator(auth.uid)), doc => doc.exists )();
  }));
