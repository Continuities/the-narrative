/**
 * Model for narrative pages
 * @author mtownsend
 * @since July 2020
 * @flow
 */

import { 
  canonPages, 
  draftPage, 
  queryEmitter,
  pages,
  page,
  toApprove,
  toVote
} from '../service/firebase';
import { activeNarrativeEmitter } from './narrative';
import { join, map, useEmitter } from '../util/emitter';

import type { Narrative } from './narrative';

export type Page = {|
  id: string,
  authorUid: string,
  isCanon: boolean,
  moderation: 'PENDING' | 'APPROVED' | 'REJECTED',
  number: number,
  text: string
|}

const asPage = snapshot => {
  const data = snapshot.data();
  return {
    id: snapshot.id,
    authorUid: data.authorUid,
    isCanon: data.isCanon || false,
    moderation: data.moderation || 'PENDING',
    number: data.number,
    text: data.text
  };
};

export const usePages = (narrativeId:string) => {
  const emitter = map(queryEmitter(canonPages(narrativeId)), snapshot => {
    const pages:Array<Page> = [];
    snapshot.forEach(s => { 
      pages.push(asPage(s));
    });
    return pages;
  });
  return useEmitter(emitter);
};

export const useDraft = (authorUid:string, narrativeId:string, pageNumber:number) => {
  const emitter = map(
    queryEmitter(draftPage(authorUid, narrativeId, pageNumber)), 
    snapshot => snapshot.empty ? null : asPage(snapshot.docs[0]));
  return useEmitter(emitter);
};

export const saveDraft = (pageId:?string, authorUid:string, narrativeId:string, pageNumber:number, text:string) => {
  const page = {
    authorUid,
    isCanon: false,
    number: pageNumber,
    moderation: 'PENDING',
    text
  };
  const col = pages(narrativeId);
  if (!pageId) {
    col.add(page);
  }
  else {
    col.doc(pageId).set(page);
  }
};

export const useToApprove = () => {
  const narrative = activeNarrativeEmitter();
  const emitter = join<Narrative, Array<Page>>(narrative, n => {
    if (!n) {
      return null;
    }
    return map(
      queryEmitter(toApprove(n.id, n.canonLength + 1)),
      s => s.docs.map(asPage))()
  });
  return useEmitter(emitter);
};

export const approveDraft = (narrativeId:string, pageId:string, approved:boolean) => {
  page(narrativeId, pageId).update({
    moderation: approved ? 'APPROVED' : 'REJECTED'
  });
};

export const useVoteList = (narrativeId:string, pageNumber:number):?Array<Page> => {
  return useEmitter(map(
    queryEmitter(toVote(narrativeId, pageNumber)),
    s => s.docs.map(d => asPage(d))
  ));
};

export const makeCanon = (narrativeId:string, pageId:string) => {
  page(narrativeId, pageId).update({ isCanon: true });
};
