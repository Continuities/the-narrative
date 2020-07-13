/**
 * Frame for app content, containing nav and auth
 * @author mtownsend
 * @since July 2020
 * @flow
 */

import React from 'react';
import AuthorMenu from './AuthorMenu';
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({
  frame: {
    height: '100%'
  },
  author: {
    position: 'absolute',
    top: '20px',
    right: '20px'
  },
  main: {
    height: '100%',
    padding: '20px 40px',
    margin: '0 auto',
    maxWidth: '768px'
  }
});

type Props = {|
  children: React$Node
|}

export default ({ children }: Props) => {
  const styles = useStyles();

  return (
    <div className={styles.frame}>
      <nav className={styles.author}>
        <AuthorMenu />
      </nav>
      <main className={styles.main}>
        {children}
      </main>
    </div>
  )
};
