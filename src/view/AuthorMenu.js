/**
 * Menu for account-related stuff
 * @author mtownsend
 * @since July 2020
 * @flow
 */

import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { logout } from '../service/firebase';
import { nextStage, useActiveNarrative, reset } from '../model/narrative';
import { useIsModerator } from '../model/user';
import Login from './Login';
import Modal from './Modal';
import Menu from './Menu';
import PageModeration from './PageModeration';
import { AccountCircle } from '@material-ui/icons';
import FadeIn from './FadeIn';

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
  const authData = useIsModerator();
  const narrative = useActiveNarrative();
  const [ showing, setShowing ] = useState(null);
  const styles = useStyles();

  const auth = authData && authData.left;
  const isMod = authData && authData.right;

  const close = () => setShowing(null);

  const menu = (
    <Menu>
      { isMod && <div key='mod' onClick={() => setShowing('mod')}>Moderate</div> }
      { isMod && narrative && narrative.status !== 'COMPLETE' && (
        <div key='next' onClick={() => {
          nextStage(narrative);
          setShowing(null);
        }}>
          { narrative.status === 'DRAFT' ? 'Start voting' : 'End voting' }
        </div>
      ) }
      { isMod && narrative && (
        <div key='reset' onClick={() => {
          reset(narrative);
          setShowing(null);
        }}>
          Reset narrative
        </div>
      )}
      <div key='logout' onClick={() => { logout().then(close); }}>Logout</div>
    </Menu>
  );

  return (
    <div 
      onClick={() => setShowing('menu')}
      className={styles.button}
    >
      <FadeIn in={showing == 'menu'}>
        <Modal close={close}>
          { auth 
            ? menu
            : <Login onSignin={close} />
          }
        </Modal>
      </FadeIn>
      <FadeIn in={showing == 'mod'}>
        <Modal close={close}>
          <PageModeration />
        </Modal>
      </FadeIn>
      { auth 
        ? <AuthorIcon auth={auth} />
        : <AccountCircle className={styles.icon}/>
      }
    </div>
  );
};
