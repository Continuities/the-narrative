/**
 * Model object for Narratives
 * @author mtownsend
 * @since July 2020
 * @flow
 */

import { narrative, activeNarrative, queryEmitter, pages } from '../service/firebase';
import { map, useEmitter } from '../util/emitter';
import { getWinningPage, clearVotes } from './vote';
import { makeCanon } from './page';

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

export const nextStage = (n:Narrative) => {
  switch (n.status) {
  case 'DRAFT':
    return startVote(n);
  case 'VOTE':
    return endVote(n);
  }
};

export const startVote = (n:Narrative) => {
  narrative(n.id).update({ status: 'VOTE' });
};

export const endVote = async (n:Narrative) => {
  const winnerId = await getWinningPage(n.id);
  narrative(n.id).update({
    status: 'DRAFT',
    canonLength: n.canonLength + 1
  });
  makeCanon(n.id, winnerId);
  clearVotes(n.id);
};

export const reset = async (n:Narrative) => {
  narrative(n.id).update({
    status: 'DRAFT',
    canonLength: 0
  });
  (await pages(n.id).get()).forEach(p => { p.ref.delete(); });
  clearVotes(n.id);
};
