/**
 * Simple menu
 * @author mtownsend
 * @since July 2020
 * @flow
 */

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  menu: {
    margin: 0,
    padding: 0,
    listStyle: 'none'
  },
  item: {
    marginTop: '10px',
    cursor: 'pointer',
    '&:first-child': {
      marginTop: 0
    }
  }
});

type Props = {|
  children: React$Node
|};

export default ({ children }: Props) => {
  const styles = useStyles();
  const items = Array.isArray(children) ? children : [ children ];
  return (
    <ul className={styles.menu}>
      {items.filter(Boolean).map((item, index) => (
        <li key={index} className={styles.item}>
          {item}
        </li>
      ))}
    </ul>
  );
};
