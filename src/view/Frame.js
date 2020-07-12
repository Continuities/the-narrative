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
  author: {
    position: 'absolute',
    top: '20px',
    right: '20px'
  }
});

type Props = {|
  children: React$Node
|}

export default ({ children }: Props) => {
  const styles = useStyles();

  return (
    <div>
      <nav className={styles.author}>
        <AuthorMenu />
      </nav>
      <main>
        {children}
      </main>
    </div>
  )
};
