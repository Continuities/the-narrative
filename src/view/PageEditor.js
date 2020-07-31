/**
 * Modal for creating/editing draft pages
 * @author mtownsend
 * @since July 2020
 * @flow
 */

import React, { useState } from 'react';
import Modal from './Modal';
import Login from './Login';
import EditorForm from './EditorForm';
import FadeIn from './FadeIn';
import { makeStyles } from '@material-ui/core/styles';
import { Create } from '@material-ui/icons';
import { useEmitter } from '../util/emitter';
import {  authEmitter } from '../service/firebase';

const useStyles = makeStyles({
  button: {
    borderRadius: '50%',
    width: '80px',
    height: '80px',
    border: '1px solid #ccc',
    background: 'white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer'
  },
  heading: {
    fontSize: '22px',
    marginBottom: '20px'
  }
});

type Props = {|
  narrativeId: string,
  pageNumber: number
|};

export default ({ narrativeId, pageNumber }: Props) => {
  const auth = useEmitter(authEmitter());
  const [ open, setOpen ] = useState(false);
  const styles = useStyles();
  return (
    <React.Fragment>
      <div 
        className={styles.button}
        onClick={() => setOpen(true)}
      >
        <Create fontSize='large' />
      </div>
      <FadeIn in={open}>
        <Modal noButton close={() => setOpen(false)}>
          { auth ? (
            <EditorForm 
              narrativeId={narrativeId}
              authorUid={auth.uid}
              pageNumber={pageNumber} 
              close={() => setOpen(false)}
            />
          ) : (
            <React.Fragment>
              <div className={styles.heading}>You must be signed in to add to the narrative</div>
              <Login />
            </React.Fragment>
          )}
        </Modal>
      </FadeIn>
    </React.Fragment>
  );
};
