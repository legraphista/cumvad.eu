import React from "react";
import {Divider, makeStyles} from "@material-ui/core";
import {Questions} from "./questions";
import {ImageManip} from "./image-result/image-manip";
import './index.css'

const useStyles = makeStyles(theme => ({
  main: {
    background: theme.palette.background.default
  }
}));

export const Main = () => {

  const classes = useStyles();

  return (
    <div className={`full-height full-width ${classes.main} main-container`}>
      <div className={'half'}>
        <Questions/>
      </div>

      <Divider/>

      <div className={'half'}>
        <ImageManip/>
      </div>
    </div>
  );

};