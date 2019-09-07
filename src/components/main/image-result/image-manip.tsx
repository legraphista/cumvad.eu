import {observer} from "mobx-react-lite";
import React, {useContext, useEffect, useRef, useState} from "react";
import {QuestionStore} from "../question-store";
import angles from './angles.png';
import {Collapse, makeStyles, Tab, Tabs} from "@material-ui/core";
import PinchToZoom from "react-pinch-and-zoom";
import panel from "./panel.png";
import ArrowUpward from '@material-ui/icons/ArrowUpward'
import Fullscreen from '@material-ui/icons/Fullscreen'
import FullscreenExit from '@material-ui/icons/FullscreenExit'
import {CanvasRender} from "./canvas-render";

const useStyles = makeStyles(theme => ({
  fsItem: {
    background: theme.palette.background.default
  },
  actionButton: {
    fontSize: '50px',
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
  },
  center: {
    margin: '0 auto',
    alignSelf: 'center'
  }
}));


const src2img = (src: string): HTMLImageElement => {
  const img = new Image();
  img.src = src;
  return img;
};
const file2img = async (file: File): Promise<HTMLImageElement> => {
  const img = new Image();

  const data = await new Promise<string>((res, rej) => {
    const reader = new FileReader();

    reader.onload = () => res(reader.result as string);
    reader.onerror = rej;

    reader.readAsDataURL(file);
  });

  img.src = data;

  return img;
};

const defaultImages = {
  angles: src2img(angles),
  panel: src2img(panel)
};

export const ImageManip = observer(() => {
  const classes = useStyles();
  const state = useContext(QuestionStore);

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

  const canvasRenderRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [imageCollapsed, setImageCollapsed] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [currentImage, setCurrentImage] = useState(defaultImages.angles);

  return (
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
      <Collapse in={!imageCollapsed} collapsedHeight={'120px'}>
        <Tabs
          value={tabValue}
          onChange={(e, v) => setTabValue(v)}
          centered={true}
        >
          <Tab label="Angles" onClick={() => setCurrentImage(defaultImages.angles)}/>
          <Tab label="Panel" onClick={() => setCurrentImage(defaultImages.panel)}/>
          <Tab label="Image" onClick={() => {
            inputRef.current && inputRef.current.click();
          }}/>
        </Tabs>
        <input
          hidden={true}
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={(e) =>
            e.target &&
            e.target.files &&
            e.target.files[0] &&
            file2img(e.target.files[0]).then(setCurrentImage)
          }
        />

        <PinchToZoom
          debug={false}
          className={[
            classes.zoomArea,
            isFullScreen ? classes.screenHeight : ''
          ].join(' ')}
          minZoomScale={0.9}
          maxZoomScale={10}
          boundSize={{height: 0, width: 0}}
          contentSize={{height: 0, width: 0}}
        >

          <CanvasRender
            currentImage={currentImage}
          />
        </PinchToZoom>
      </Collapse>
    </div>
  );
})