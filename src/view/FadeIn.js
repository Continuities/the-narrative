/**
 * Transition group for fading something in
 * @author mtownsend
 * @since July 2020
 * @flow
 */

import React from 'react';
import { CSSTransition } from 'react-transition-group';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  enter: {
    opacity: '0'
  },
  enterActive: {
    opacity: '1',
    transition: 'opacity 200ms'
  },
  exit: {
    opacity: '0',
    transition: 'opacity 200ms'
  }
});

type Props = {|
  in: boolean,
  children: React$Node
|};

export default ({ in: inProp, children }: Props) => {
  const styles = useStyles();
  return (
    <CSSTransition 
      in={inProp}
      timeout={{
        exit: 200
      }}
      classNames={{
        enter: styles.enter,
        enterDone: styles.enterActive,
        exit: styles.exit
      }}
      unmountOnExit
    >
      {children}
    </CSSTransition>
  );
};

