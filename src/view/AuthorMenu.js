/**
 * Menu for account-related stuff
 * @author mtownsend
 * @since July 2020
 * @flow
 */

import React, { useState } from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { makeStyles } from '@material-ui/core/styles';
import { 
  authEmitter, 
  signInOptions, 
  firebaseAuth,
  logout
} from '../service/firebase';
import { useEmitter } from '../util/emitter';
import Modal from './Modal';
import { AccountCircle } from '@material-ui/icons';

const useStyles = makeStyles({
  button: {
    borderRadius: '50%',
    width: '50px',
    height: '50px',
    cursor: 'pointer',
    border: '1px solid #ccc',
    overflow: 'hidden'
  },
  icon: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '30px'
  }
});

const getDisplay = auth => {

  const styles = useStyles();

  if (!auth) {
    return null;
  }
  if (auth.photoURL) {
    return <img className={styles.icon} src={auth.photoURL} />;
  }

  const char = (auth.displayName || auth.email || auth.uid)[0];
  return <div className={styles.icon}>{char}</div>;
};

export default () => {
  const auth = useEmitter(authEmitter());
  const [ showMenu, setShowMenu ] = useState(false);
  const styles = useStyles();

  const authUiConfig = {
    signInFlow: 'popup',
    signInOptions,
    callbacks: {
      // Avoid redirects after sign-in.
      signInSuccessWithAuthResult: () => {
        setShowMenu(false);
        return false;
      }
    }
  };

  const display = getDisplay(auth);

  return (
    <div 
      onClick={() => setShowMenu(true)}
      className={styles.button}
    >
      { showMenu && (
        <Modal close={() => setShowMenu(false)}>
          { auth 
            ? <div onClick={logout}>LOGOUT</div> 
            : <StyledFirebaseAuth uiConfig={authUiConfig} firebaseAuth={firebaseAuth()}/>
          }
        </Modal>
      )}
      { auth 
        ? display
        : <AccountCircle className={styles.icon}/>
      }
    </div>
  );
};
