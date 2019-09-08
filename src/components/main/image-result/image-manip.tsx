import {observer} from "mobx-react-lite";
import React, {RefObject, useContext, useEffect, useRef, useState} from "react";
import {QuestionStore} from "../question-store";
import angles from './angles.png';
import {Collapse, makeStyles, Tab, Tabs} from "@material-ui/core";
import PinchToZoom from "react-pinch-and-zoom";
import panel from "./panel.png";
import ArrowUpward from '@material-ui/icons/ArrowUpward'
import Fullscreen from '@material-ui/icons/Fullscreen'
import FullscreenExit from '@material-ui/icons/FullscreenExit'
import SaveIcon from '@material-ui/icons/SaveAlt'
import {CanvasRender} from "./canvas-render";

const useStyles = makeStyles(theme => ({
  fsItem: {
    background: theme.palette.background.default,
    position: 'relative'
  },
  actionButton: {
    fontSize: '48px',
    position: 'absolute',
    zIndex: 1
  },
  left: {
    left: 0
  },
  right: {
    right: 0
  },
  bottom: {
    bottom: 0
  },
  zoomArea: {
    zIndex: 0,
    width: '100%',
    // height: '100%'
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
const resizeImage = (img: HTMLImageElement, maxSize = 2000): HTMLImageElement => {

  const i_ar = img.width / img.height;
  let iw = img.width;
  let ih = img.height;

  if (iw > maxSize) {
    iw = maxSize;
    ih = iw / i_ar;
  }
  if (ih > maxSize) {
    ih = maxSize;
    iw = ih * i_ar;
  }

  const canvas = document.createElement('canvas');
  canvas.width = iw;
  canvas.height = ih;

  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return img;
  }

  ctx.drawImage(
    img,
    0, 0,
    img.width, img.height,
    0, 0,
    iw, ih
  );

  const newImg = new Image(iw, ih);
  newImg.src = canvas.toDataURL('image/png');
  return newImg;
}

const defaultImages = {
  angles: src2img(angles),
  panel: src2img(panel)
};

const saveCanvas = (c: RefObject<HTMLCanvasElement> | null, f: string = 'image.png') => {
  if (!c || !c.current) {
    return;
  }
  const blobStr = c.current.toDataURL('image/png').substr('data:image/png;base64,'.length);
  const blobDecoded = atob(blobStr);
  console.log(blobStr);
  const blobArrayBuffer = new ArrayBuffer(blobDecoded.length);
  const blobUint8 = new Uint8Array(blobArrayBuffer);

  for (let i = 0; i < blobDecoded.length; i += 1) {
    blobUint8[i] = blobDecoded.charCodeAt(i);
  }

  const blob = new Blob(
    [blobUint8],
    {type: 'image/png'}
  );
  const blobURL = URL.createObjectURL(blob);

  const dl = document.createElement('a');
  dl.download = f;
  dl.href = blobURL;
  dl.click();
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

  const canvasHolderRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [imageCollapsed, setImageCollapsed] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [currentImage, setCurrentImage] = useState(defaultImages.angles);

  return (
    <div ref={canvasHolderRef} className={classes.fsItem}>

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
            canvasHolderRef.current &&
            canvasHolderRef.current
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

      <SaveIcon
        className={[classes.actionButton, classes.right, classes.bottom].join(' ')}
        onClick={() => saveCanvas(state.registeredCanvas)}
      />

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
            file2img(e.target.files[0])
              .then(resizeImage)
              .then((img) => {
                setCurrentImage(img);
                if (inputRef.current) {
                  inputRef.current.value = '';
                }
              })
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