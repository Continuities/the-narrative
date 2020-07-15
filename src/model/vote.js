/**
 * Model interface for voting
 * @author mtownsend
 * @since July 2020
 * @flow
 */

import { 
  votes, 
  docEmitter,
  authEmitter
} from '../service/firebase';
import { join, map, useEmitter } from '../util/emitter';

type Vote = {|
  pageId: string
|};

export const useVote = (narrativeId:string) =>
  useEmitter(join<$npm$firebase$auth$User, ?Vote>(authEmitter(), auth => 
    map(
      docEmitter(votes(narrativeId).doc(auth.uid)), 
      doc => !doc.exists ? null : { pageId: doc.data().pageId }
    )()
  ));

export const getWinningPage = async (narrativeId:string) => {
  const snapshot:$npm$firebase$firestore$QuerySnapshot = await votes(narrativeId).get();

  const counts = new Map<string, number>();
  snapshot.forEach(v => {
    const pageId = v.data().pageId;
    counts.set(pageId, (counts.get(pageId) || 0) + 1);
  });
  return [...counts.entries()].sort(([,a], [,b]) => b - a)[0][0];
}

export const clearVotes = async (narrativeId:string) => {
  const ballots:$npm$firebase$firestore$QuerySnapshot = await votes(narrativeId).get();
  ballots.forEach(b => { b.ref.delete(); });
};

export const voteFor = (authorId:string, narrativeId:string, pageId:string) => {
  votes(narrativeId).doc(authorId).set({ pageId });
};
