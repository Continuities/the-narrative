/**
 * Menu for account-related stuff
 * @author mtownsend
 * @since July 2020
 * @flow
 */

import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { 
  authEmitter, 
  logout
} from '../service/firebase';
import Login from './Login';
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

const AuthorIcon = ({ auth }: { auth: $npm$firebase$auth$User }) => {
  const styles = useStyles();

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

  const close = () => setShowMenu(false);

  return (
    <div 
      onClick={() => setShowMenu(true)}
      className={styles.button}
    >
      { showMenu && (
        <Modal close={close}>
          { auth 
            ? <div onClick={() => { logout().then(close); }}>LOGOUT</div> 
            : <Login onSignin={close} />
          }
        </Modal>
      )}
      { auth 
        ? <AuthorIcon auth={auth} />
        : <AccountCircle className={styles.icon}/>
      }
    </div>
  );
};
