import {observer} from "mobx-react-lite";
import React, {RefObject, useContext, useEffect, useRef} from "react";
import {QuestionStore} from "../question-store";
import {QuestionIDs} from "../questions-list/common";
import {IQuestion} from "../questions-list";
import uuid from 'uuid';

async function imageLoad(img: HTMLImageElement) {
  if (img.complete) return;

  if (img.decode) {
    return await img.decode();
  }

  return await new Promise((res, rej) => {
    img.addEventListener('load', res);
    img.addEventListener('error', rej);
  });
}

function updateCanvasSize(canvasRef: RefObject<HTMLCanvasElement>) {
  const canvas = canvasRef.current;
  if (!canvas) {
    return
  }

  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}

async function initCanvas(image: HTMLImageElement, canvasRef: RefObject<HTMLCanvasElement>) {
  if (!canvasRef.current) {
    console.warn('we don\'t have a canvas yet!');
    return;
  }

  const canvas = canvasRef.current;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    console.warn('we don\'t have a ctx yet!');
    return;
  }

  console.log('rendering canvas', new Date());

  await imageLoad(image);

  const imageWidth = image.width;
  const imageHeight = image.height;
  const imageAr = imageWidth / imageHeight;

  canvas.height = canvas.width / imageAr;

  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;

  const scale = canvasWidth / imageWidth;

  canvas.style.width = canvasWidth + "px";
  canvas.style.height = canvasHeight + "px";
  canvas.width /= scale;
  canvas.height /= scale;
}

let last_render: string = uuid();

export async function renderCanvas(image: HTMLImageElement, questions: ({ [s in QuestionIDs]: IQuestion<any> }), canvasRef: RefObject<HTMLCanvasElement>, showOriginal: boolean) {
  const this_render = uuid();
  last_render = this_render;

  if (!canvasRef.current) {
    console.warn('we don\'t have a canvas yet!');
    return;
  }

  const canvas = canvasRef.current;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    console.warn('we don\'t have a ctx yet!');
    return;
  }
  const imageWidth = image.width;
  const imageHeight = image.height;

  console.log('rendering canvas', new Date());

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.imageSmoothingEnabled = false;
  // ctx.imageSmoothingQuality = "high";
  ctx.drawImage(image,
    0, 0,
    imageWidth, imageHeight,
    0, 0,
    canvas.width, canvas.height);

  if (!showOriginal) {
    const qlist = Object.keys(questions).map((q_id) => questions[q_id as QuestionIDs])

    for (let i = 0; i < qlist.length; i++) {
      const q = qlist[i];

      await new Promise(_ => requestAnimationFrame(_));

      // this is here to break the chain of the previous render if a new one is initiated
      if (last_render === this_render) {
        const key = `canvas-${q.question.id}`;
        console.time(key);
        q.effect(ctx, q.selected, {
          original: image
        });
        console.timeEnd(key);
      } else {
        console.log('break render', this_render, last_render);
        break;
      }
    }
  }


}

export type CanvasRenderProps = {
  currentImage: HTMLImageElement
}

export const CanvasRender = observer(({currentImage}: CanvasRenderProps, canvasRef: React.RefObject<HTMLCanvasElement>) => {
  if (!canvasRef) {
    canvasRef = useRef<HTMLCanvasElement>(null);
  }

  const state = useContext(QuestionStore);

  const questions = state.questions;

  state.registeredCanvas = canvasRef;
  state.registeredImage = currentImage;

  useEffect(() => {
    updateCanvasSize(canvasRef);
    initCanvas(currentImage, canvasRef)
      .then(() => renderCanvas(currentImage, questions, canvasRef, state.showOriginal))
  });

  return (
    <div className="full-width full-height" style={{display: 'flex'}}>
      <canvas ref={canvasRef} className="full-height" style={{margin: "0 auto"}}/>
    </div>
  )

}, {forwardRef: true});
