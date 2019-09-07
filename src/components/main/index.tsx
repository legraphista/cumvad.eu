import React, {useEffect, useRef, useState} from "react";
import {Box, Collapse, Divider, makeStyles} from "@material-ui/core";
import {Questions} from "./questions";
import {CanvasRender} from "./image-result";

import ArrowUpward from '@material-ui/icons/ArrowUpward'
import Fullscreen from '@material-ui/icons/Fullscreen'
import FullscreenExit from '@material-ui/icons/FullscreenExit'
import PinchToZoom from "react-pinch-and-zoom";

const useStyles = makeStyles(theme => ({
  fsItem: {
    background: theme.palette.background.default
  },
  actionButton: {
    fontSize: '52px',
    position: 'absolute',
    zIndex: 1
  },
  left: {
    left: 0
  },
  right: {
    right: 0
  },
  zoomArea: {
    zIndex: 0,
    width: '100%',
    height: '100%'
  },
  screenHeight: {
    height: '100vh'
  }
}));

export const Main = () => {
  const classes = useStyles();
  const canvasRenderRef = useRef<HTMLDivElement>(null);

  const [imageCollapsed, setImageCollapsed] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    const fullscreenChange = () => {
      setImageCollapsed(false);
      setIsFullScreen(!!document.fullscreenElement);
    };
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
        {!isFullScreen ?
          <ArrowUpward
            onClick={() => setImageCollapsed(!imageCollapsed)}
            className={[classes.actionButton, classes.left].join(' ')}
            style={{
              transform: imageCollapsed ? '' : 'rotate(180deg)',
              transition: 'transform .3s ease-out',
            }}
          /> : null}

        {!isFullScreen ?
          <Fullscreen
            className={[classes.actionButton, classes.right].join(' ')}
            onClick={() =>
              canvasRenderRef.current &&
              canvasRenderRef.current
                .requestFullscreen({navigationUI: 'hide'})
                .then(() => setIsFullScreen(true))
            }
          /> :
          <FullscreenExit
            className={[classes.actionButton, classes.right].join(' ')}
            onClick={() =>
              document.exitFullscreen()
                .then(() => setIsFullScreen(false))
            }
          />
        }
        <Collapse in={!imageCollapsed} collapsedHeight={'60px'} style={{height: '100%'}}>
          <PinchToZoom
            debug={false}
            className={[
              classes.zoomArea,
              isFullScreen ? classes.screenHeight : ''
            ].join(' ')}
            minZoomScale={0.9}
            maxZoomScale={5}
          >
            <CanvasRender/>
          </PinchToZoom>
        </Collapse>
      </div>
    </div>
  );

};