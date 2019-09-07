import React from "react";
import {Divider, makeStyles} from "@material-ui/core";
import {Questions} from "./questions";
import {ImageManip} from "./image-result/image-manip";

const useStyles = makeStyles(theme => ({
  main: {
    background: theme.palette.background.default
  },

}));

export const Main = () => {

  const classes = useStyles();

  return (
    <div className={`full-height full-width ${classes.main}`} style={{display: 'flex', flexFlow: 'column'}}>
      <div style={{flexGrow: 1}}>
        <Questions/>
      </div>

      <Divider/>

      <ImageManip/>
    </div>
  );

};