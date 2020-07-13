/**
 * Model for narrative pages
 * @author mtownsend
 * @since July 2020
 * @flow
 */

import { canonPages, draftPage, dbEmitter } from '../service/firebase';
import { map, useEmitter } from '../util/emitter';

export type Page = {|
  id: string,
  authorUid: string,
  isCanon: boolean,
  number: number,
  text: string
|}

const asPage = snapshot => {
  const data = snapshot.data();
  return {
    id: snapshot.id,
    authorUid: data.authorUid,
    isCanon: data.isCanon,
    number: data.number,
    text: data.text
  };
};

export const usePages = (narrativeId:string) => {
  const emitter = map(dbEmitter(canonPages(narrativeId)), snapshot => {
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
    dbEmitter(draftPage(authorUid, narrativeId, pageNumber)), 
    snapshot => snapshot.empty ? null : asPage(snapshot.docs[0]));
  return useEmitter(emitter);
};


