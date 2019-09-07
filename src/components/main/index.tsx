import React from "react";
import {GridList, makeStyles, Paper} from "@material-ui/core";
import {Grid} from '@material-ui/core';
import {Questions} from "./questions";

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%'
  },

  topItem: {
    flexBasis: '66%',
    overflow: 'auto'
  },
  bottomItem: {}
}));

export const Main = () => {
  const classes = useStyles();

  return (
    <Grid container spacing={2} direction={'column'} className={classes.root}>

      <Grid item className={classes.topItem}>
        <Questions/>
      </Grid>
      <Grid item className={classes.bottomItem}>
        <Paper>world</Paper>
      </Grid>

    </Grid>
  );

};