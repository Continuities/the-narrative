/**
 * UI for voting on next pages
 * @author mtownsend
 * @since July 2020
 * @flow
 */

import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { useVoteList } from '../model/page';
import { useVote, voteFor } from '../model/vote';

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
    display: 'flex',
    marginBottom: '10px',
    flexDirection: 'column',
    '@media(min-width:640px)': {
      '&': {
        flexDirection: 'row', 
      }
    }
  },
  votedFor: {
    borderColor: 'red'
  },
  count: {
    padding: '10px',
    background: '#111',
    color: 'white',
    textAlign: 'center',
    '@media(min-width:640px)': {
      '&': {
        width: '150px', 
      }
    }
  },
  words: {
    padding: '10px',
    display: 'flex',
  },
  word: {
    margin: '0 5px'
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

  const voteList = useVoteList(narrative.id, narrative.canonLength + 1) || [];
  const voteData = useVote(narrative.id);
  const authorId = voteData && voteData.left.uid;
  const voteId = voteData && voteData.right && voteData.right.pageId;

  return (
    <ul className={styles.list}>
      { voteList.map(page => 
        <VoteOption 
          key={page.id} 
          page={page} 
          votedFor={voteId === page.id}
          onClick={() => authorId && voteFor(authorId, narrative.id, page.id)}
        />
      )}
    </ul>
  );
};
