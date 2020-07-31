/**
 * Controlled form for submitting pages
 * @author mtownsend
 * @since July 2020
 * @flow
 */

import React, { useState } from 'react';
import { saveDraft, useDraft } from '../model/page';
import { makeStyles } from '@material-ui/core/styles';
import { Done, Close } from '@material-ui/icons';
import Button, { ButtonContainer } from './Button';
import { initNotifications } from '../service/firebase';

const useStyles = makeStyles({
  container: {
    width: 'calc(100vw - 80px)',
    maxWidth: 'calc(90vw - 40px)',
    height: 'calc(100vh - 80px)',
    display: 'flex',
    flexDirection: 'column'
  },
  heading: {
    fontSize: '22px',
    marginBottom: '20px'
  },
  editor: {
    flexGrow: 1,
    resize: 'none',
    padding: '10px'
  }
});

type Props = {|
  authorUid: string,
  narrativeId: string,
  pageNumber: number,
  close: () => void
|};

export default ({ authorUid, narrativeId, pageNumber, close }: Props) => {
  const styles = useStyles();
  const draft = useDraft(authorUid, narrativeId, pageNumber);
  const [ text, setText ] = useState('');

  if (draft && text == '') {
    setText(draft.text);
  }

  return (
    <div className={styles.container}>
      <div className={styles.heading}>
        What&apos;s your version of page {pageNumber}?
      </div>
      <textarea 
        className={styles.editor} 
        onChange={e => setText(e.target.value)}
        value={text} 
      />
      <ButtonContainer>
        <Button onClick={() => {
          if (!text) {
            return;
          }
          initNotifications();
          saveDraft(draft && draft.id, authorUid, narrativeId, pageNumber, text);
          close();
        }}>
          <Done />
        </Button>
        <Button onClick={() => close()}>
          <Close />
        </Button>
      </ButtonContainer>
    </div>
  );
};
