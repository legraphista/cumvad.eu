import React, {useEffect, useRef, useState} from "react";
import {Box, Collapse, Divider, makeStyles} from "@material-ui/core";
import {Questions} from "./questions";
import {CanvasRender} from "./image-result";

import ArrowUpward from '@material-ui/icons/ArrowUpward'
import Fullscreen from '@material-ui/icons/Fullscreen'
import FullscreenExit from '@material-ui/icons/FullscreenExit'

const useStyles = makeStyles(theme => ({
  fsItem: {
    background: theme.palette.background.default
  }
}));

export const Main = () => {
  const classes = useStyles();
  const canvasRenderRef = useRef<HTMLDivElement>(null);

  const [imageCollapsed, setImageCollapsed] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {

    const fullscreenChange = () => setIsFullScreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", fullscreenChange);

    return function cleanup() {
      document.removeEventListener("fullscreenchange", fullscreenChange);
    }
  }, []);

  return (
    <div className="full-height full-width" style={{display: 'flex', flexFlow: 'column'}}>
      <div style={{flexGrow: 1}}>
        <Questions/>
      </div>
      <Divider/>
      <div ref={canvasRenderRef} className={classes.fsItem}>
        <ArrowUpward
          onClick={() => setImageCollapsed(!imageCollapsed)}
          style={{
            transform: imageCollapsed ? '' : 'rotate(180deg)',
            transition: 'transform .3s ease-out',
            fontSize: '52px',
            position: 'absolute'
          }}
        />
        {!isFullScreen ?
          <Fullscreen
            style={{
              fontSize: '52px',
              position: 'absolute',
              right: 0
            }}
            onClick={() =>
              canvasRenderRef.current &&
              canvasRenderRef.current
                .requestFullscreen({navigationUI: 'hide'})
                .then(() => setIsFullScreen(true))
            }
          /> :
          <FullscreenExit
            style={{
              fontSize: '52px',
              position: 'absolute',
              right: 0
            }}
            onClick={() =>
              document.exitFullscreen()
                .then(() => setIsFullScreen(false))
            }
          />
        }
        <Collapse in={!imageCollapsed} collapsedHeight={'60px'}>
          <CanvasRender/>
        </Collapse>
      </div>
    </div>
  );

};