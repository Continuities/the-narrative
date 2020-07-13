/**
 * Controlled form for submitting pages
 * @author mtownsend
 * @since July 2020
 * @flow
 */

import React, { useState } from 'react';
import { useDraft } from '../model/page';
import { makeStyles } from '@material-ui/core/styles';
import { Done, Close } from '@material-ui/icons';
import { upsertDraft } from '../service/firebase';

const useStyles = makeStyles({
  container: {
    width: 'calc(100vw - 80px)',
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
  },
  buttons: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '20px'
  },
  button: {
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    border: '1px solid #ccc',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    margin: '0 10px'
  }
});

const EditorButton = ({ children, onClick }: { children: React$Node, onClick: () => void }) => {
  const styles = useStyles();
  return (
    <div className={styles.button} onClick={onClick}>
      {children}
    </div>
  );
};

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
      <div className={styles.buttons}>
        <EditorButton onClick={() => {
          upsertDraft(draft && draft.id, authorUid, narrativeId, pageNumber, text);
          close();
        }}>
          <Done />
        </EditorButton>
        <EditorButton onClick={() => close()}>
          <Close />
        </EditorButton>
      </div>
    </div>
  );
};
