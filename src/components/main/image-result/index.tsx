import {observer} from "mobx-react-lite";
import React, {RefObject, useContext, useEffect, useRef, useState} from "react";
import {QuestionStore} from "../question-store";
import {QuestionIDs} from "../questions-list/common";
import {IQuestion} from "../questions-list";
import angles from './angles.png';

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

async function renderCanvas(image: HTMLImageElement, questions: ({ [s in QuestionIDs]: IQuestion<any> }), canvasRef: RefObject<HTMLCanvasElement>) {
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

  ctx.imageSmoothingEnabled = false;
  // ctx.imageSmoothingQuality = "high";
  ctx.drawImage(image,
    0, 0,
    imageWidth, imageHeight,
    0, 0,
    canvas.width, canvas.height);
}


export type CanvasRenderProps={
  currentImage: HTMLImageElement
}

export const CanvasRender = observer(({currentImage}: CanvasRenderProps, ref: React.Ref<HTMLDivElement>) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const state = useContext(QuestionStore);

  const questions = state.questions;

  useEffect(() => {
    updateCanvasSize(canvasRef);
    renderCanvas(currentImage, questions, canvasRef);
  });

  return (
    <div ref={ref} className="full-width full-height" style={{display: 'flex'}}>
      <canvas ref={canvasRef} className="full-height" style={{margin: "0 auto"}}/>
    </div>
  )

}, {forwardRef: true});