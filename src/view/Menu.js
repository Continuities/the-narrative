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
    margin: '10px 0 0',
    paddingTop: '10px',
    borderTop: '1px solid #ccc',
    fontSize: '24px',
    cursor: 'pointer',
    textAlign: 'center',
    '&:first-child': {
      marginTop: 0,
      borderTop: 'none',
      paddingTop: 0
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
