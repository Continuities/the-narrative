/**
 * Main view for active narrative pages
 * @author mtownsend
 * @since July 2020
 * @flow
 */

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useActivePages } from '../model/page';

import type { Page } from '../model/page';

const useStyles = makeStyles({
  page: {
    fontSize: '24px',
    lineHeight: '1.5',
    margin: '20px 0'
  }
});

const PageView = ({ page }: { page: Page }) => {
  const styles = useStyles();
  return (
    <div className={styles.page}>
      {page.text}
    </div>
  );
};

export default () => {
  const styles = useStyles();
  const pages:Array<Page> = useActivePages() || [];
  if (!pages.length) {
    return (
      <div className={styles.page}>
        The page is blank.
      </div>
    );
  }
  return (
    <React.Fragment>
      { pages.map(page => <PageView page={page} key={page.number} />) }
    </React.Fragment>
  );
};
