/**
 * Generic Portal-based modal
 * @author mtownsend
 * @since July 2020
 * @flow
 */

import React from 'react';
import { createPortal } from 'react-dom';
import { makeStyles } from '@material-ui/core/styles';

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
    right: 0
  },
  modal: {
    border: '1px solid #ccc'
  }
});

type Props = {|
  children: React$Node,
  close: () => void
|};

export default ({ children, close }: Props) => {
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
        onClick={doClose}
        className={styles.modal}
      >
        {children}
      </div>
    </div>
  );
  return createPortal(modal, portalRoot);
};
