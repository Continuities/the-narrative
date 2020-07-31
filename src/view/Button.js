/**
 * Simple button implementation
 * @author mtownsend
 * @since July 2020
 * @flow
 */

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  button: {
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    border: '1px solid #ccc',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    margin: '0 10px',
    '-webkit-tap-highlight-color': 'transparent'
  },
  container: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '20px'
  }
});

type Props = {|
  children: React$Node, 
  onClick: () => void
|};

export default ({ children, onClick }: Props) => {
  const styles = useStyles();
  return (
    <div className={styles.button} onClick={onClick}>
      {children}
    </div>
  );
};

export const ButtonContainer = ({ children }: { children: ?React$Node }) => {
  const styles = useStyles();
  return (
    <div className={styles.container}>
      {children}
    </div>
  )
}
