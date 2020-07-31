/**
 * UI for voting on next pages
 * @author mtownsend
 * @since July 2020
 * @flow
 */

import React, { useState } from 'react';
import clsx from 'clsx';
import Modal from './Modal';
import Login from './Login';
import { makeStyles } from '@material-ui/core/styles';
import { useVoteList } from '../model/page';
import { useVote, voteFor } from '../model/vote';
import { initNotifications } from '../service/firebase';

import type { Page } from '../model/page';
import type { Narrative } from '../model/narrative';


const useStyles = makeStyles({
  list: {
    margin: 0,
    padding: 0,
    listStyle: 'none'
  },
  item: {
    cursor: 'pointer',
    fontSize: '22px',
    border: '1px solid #ccc',
    'transition': 'border-color 200ms, box-shadow 200ms',
    display: 'flex',
    marginBottom: '10px',
    flexDirection: 'column',
    borderRadius: '30px',
    overflow: 'hidden',
    boxShadow: '5px 5px 5px 0px #ccc',
    '-webkit-tap-highlight-color': 'transparent',
    '@media(min-width:640px)': {
      '&': {
        flexDirection: 'row', 
      }
    }
  },
  votedFor: {
    borderColor: '#3D9970',
    boxShadow: 'none'
  },
  count: {
    padding: '10px',
    background: '#111',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    'transition': 'background 200ms',
    '$votedFor &': {
      background: '#3D9970'
    },
    '@media(min-width:640px)': {
      '&': {
        width: '150px', 
      }
    }
  },
  words: {
    padding: '5px 10px',
    display: 'flex',
    flexWrap: 'wrap'
  },
  word: {
    margin: '5px',
    padding: '5px 10px',
    background: '#ccc',
    borderRadius: '20px'
  },
  heading: {
    fontSize: '22px',
    marginBottom: '20px'
  }
});

const IGNORED_WORDS = new Set([ 'an', 'the', 'be', 'to', 'of', 'and', 'a', 'in' ]);
const VoteOption = ({ page, votedFor, onClick }: { page: Page, votedFor: boolean, onClick:() => any }) => {
  const styles = useStyles();

  const wordCounts = new Map<string, number>();
  const rawWords = page.text.split(/\s/);
  rawWords.forEach(w => {
    const word = w.replace(/[^\w]/g, '').toLowerCase();
    if (!IGNORED_WORDS.has(word)) {
      wordCounts.set(word, (wordCounts.get(word) || 0) + 1);
    }
  });
  const wordList = [...wordCounts.entries()].sort(([,a], [,b]) => b - a);
  wordList.length = 5;
  return (
    <li className={clsx(styles.item, votedFor && styles.votedFor)} onClick={onClick}>
      <div className={styles.count}>
        {`${rawWords.length} words`}
      </div>
      <div className={styles.words}>
        { wordList.map(([ word ]) => 
          <div key={word} className={styles.word}>{word}</div>
        )}
      </div>
    </li>
  )
};

type Props = {|
  narrative: Narrative
|};

export default ({ narrative }: Props) => {
  const styles = useStyles();

  const [ showLogin, setShowLogin ] = useState(false);
  const voteList = useVoteList(narrative.id, narrative.canonLength + 1) || [];
  const voteData = useVote(narrative.id);
  const authorId = voteData && voteData.left.uid;
  const voteId = voteData && voteData.right && voteData.right.pageId;

  const castVote = pageId => {
    if (!authorId) {
      setShowLogin(true);
      return;
    }
    initNotifications();
    authorId && voteFor(authorId, narrative.id, pageId);
  }

  return (
    <React.Fragment>
      { showLogin && (
        <Modal close={() => setShowLogin(false)}>
          <div className={styles.heading}>You must be signed in to guide the narrative</div>
          <Login onSignin={() => setShowLogin(false)} />
        </Modal>
      )}
      <ul className={styles.list}>
        { voteList.map(page => 
          <VoteOption 
            key={page.id} 
            page={page} 
            votedFor={voteId === page.id}
            onClick={castVote.bind(null, page.id)}
          />
        )}
      </ul>
    </React.Fragment>
  );
};
