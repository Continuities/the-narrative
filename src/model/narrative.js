/**
 * Model object for Narratives
 * @author mtownsend
 * @since July 2020
 * @flow
 */

import { activeNarrative, queryEmitter } from '../service/firebase';
import { map, useEmitter } from '../util/emitter';

export type Narrative = {|
  id: string,
  canonLength: number,
  status: NarrativeStatus
|}

export type NarrativeStatus = 'DRAFT' | 'VOTE' | 'COMPLETE';

export const activeNarrativeEmitter = () => {
  return map<$npm$firebase$firestore$QuerySnapshot, Narrative>(queryEmitter(activeNarrative()), snapshot => {
    const data = snapshot.docs[0].data();
    return {
      id: snapshot.docs[0].id,
      canonLength: data.canonLength,
      status: data.status
    };
  });
};

export const useActiveNarrative = () => {
  return useEmitter(activeNarrativeEmitter());
};
