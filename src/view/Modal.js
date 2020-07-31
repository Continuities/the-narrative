/**
 * Generic Portal-based modal
 * @author mtownsend
 * @since July 2020
 * @flow
 */

import React from 'react';
import { createPortal } from 'react-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Close } from '@material-ui/icons';
import Button from './Button';

const portalRoot = document.getElementById('portal');
const useStyles = makeStyles({
  container: {
    position: 'absolute',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    background: 'rgba(255, 255, 255, 0.5)'
  },
  modal: {
    border: '1px solid #ccc',
    borderRadius: '20px',
    padding: '20px',
    background: 'white',
    boxShadow: '5px 5px 5px 0px #ccc',
    maxWidth: '90%'
  },
  buttons: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '20px'
  }
});

type Props = {|
  children: React$Node,
  close: () => void,
  noButton?: boolean
|};

export default ({ children, close, noButton }: Props) => {
  const styles = useStyles();
  const doClose = e => {
    e.stopPropagation();
    close();
  };
  const modal = (
    <div 
      onClick={doClose}
      className={styles.container}
    >
      <div 
        onClick={e => e.stopPropagation()}
        className={styles.modal}
      >
        {children}
        {!noButton && (
          <div className={styles.buttons}>
            <Button onClick={close}>
              <Close />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
  return portalRoot && createPortal(modal, portalRoot);
};
