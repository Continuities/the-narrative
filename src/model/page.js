/**
 * Model for narrative pages
 * @author mtownsend
 * @since July 2020
 * @flow
 */

import { activePages, firebaseEmitter } from '../service/firebase';
import { map, useEmitter } from '../util/emitter';

export type Page = {|
  authorUid: string,
  number: number,
  text: string
|}

export const useActivePages = () => {
  const emitter = map(firebaseEmitter(activePages()), snapshot => {
    const pages:Array<Page> = [];
    snapshot.forEach(s => { 
      const data = s.data();
      pages.push({
        authorUid: data.authorUid,
        number: data.number,
        text: data.text
      }) 
    });
    return pages;
  });
  return useEmitter(emitter);
};


