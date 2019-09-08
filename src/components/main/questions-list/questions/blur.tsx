import React from "react";
import {QuestionIDs, YesNoQuestionIds} from "../common";
import {IQuestion} from "../index";
import {Box, Slider, Typography} from "@material-ui/core";

const gaussianConvolutionKernel: (size: number, sigma: number) => number[] = require('gaussian-convolution-kernel');

export interface BlurQuestionExtraData {
  intensity: number
}


export const BlurQuestion: IQuestion<YesNoQuestionIds, BlurQuestionExtraData> = {
  question: {
    string: "Blurred vision?",
    id: QuestionIDs.Blur
  },
  answers: [
    {
      string: 'no',
      id: YesNoQuestionIds.no
    },
    {
      string: 'yes',
      id: YesNoQuestionIds.yes,
      extraComponent: ({extraData, setExtraData}) => {
        const value = extraData ? extraData.intensity : 0;
        return (
          <Box>
            <Typography> Blur intensity </Typography>
            <Slider
              min={0}
              max={5}
              value={value}
              step={0.1}
              onChange={(e, v) => setExtraData({intensity: v as number})}
            /></Box>)
      }
    }
  ],
  selected: {
    id: YesNoQuestionIds.no
  },
  effect: (ctx: CanvasRenderingContext2D, {id, extraData}) => {
    if (id === YesNoQuestionIds.no) {
      return;
    }

    const canvas = ctx.canvas;
    const blur = Math.min(Math.floor((extraData && extraData.intensity) || 1));

    const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const src = img.data;

    const w = img.width;
    const h = img.height;
    const len = src.length;

    const r = new Uint8Array(w * h);
    const g = new Uint8Array(w * h);
    const b = new Uint8Array(w * h);

    const r2 = new Uint8Array(w * h);
    const g2 = new Uint8Array(w * h);
    const b2 = new Uint8Array(w * h);

    for (let i = 0, j = 0; i < len; i += 4, j++) {
      r[j] = src[i + 0];
      g[j] = src[i + 1];
      b[j] = src[i + 2];
    }

    console.time('blur')

    gaussBlur_4(r, r2, w, h, blur);
    gaussBlur_4(g, g2, w, h, blur);
    gaussBlur_4(b, b2, w, h, blur);
    console.timeEnd('blur')


    for (let i = 0, j = 0; i < len; i += 4, j++) {
      src[i + 0] = r2[j];
      src[i + 1] = g2[j];
      src[i + 2] = b2[j];
    }

    ctx.putImageData(img, 0, 0);
  }
};

// gauss blur
// thanks to http://blog.ivank.net/fastest-gaussian-blur.html

function boxesForGauss(sigma: number, n: number)  // standard deviation, number of boxes
{
  var wIdeal = Math.sqrt((12 * sigma * sigma / n) + 1);  // Ideal averaging filter width
  var wl = Math.floor(wIdeal);
  if (wl % 2 == 0) wl--;
  var wu = wl + 2;

  var mIdeal = (12 * sigma * sigma - n * wl * wl - 4 * n * wl - 3 * n) / (-4 * wl - 4);
  var m = Math.round(mIdeal);
  // var sigmaActual = Math.sqrt( (m*wl*wl + (n-m)*wu*wu - n)/12 );

  var sizes = [];
  for (var i = 0; i < n; i++) sizes.push(i < m ? wl : wu);
  return sizes;
}

function gaussBlur_4(scl: Uint8Array, tcl: Uint8Array, w: number, h: number, r: number) {
  var bxs = boxesForGauss(r, 3);
  boxBlur_4(scl, tcl, w, h, (bxs[0] - 1) / 2);
  boxBlur_4(tcl, scl, w, h, (bxs[1] - 1) / 2);
  boxBlur_4(scl, tcl, w, h, (bxs[2] - 1) / 2);
}

function boxBlur_4(scl: Uint8Array, tcl: Uint8Array, w: number, h: number, r: number) {
  for (var i = 0; i < scl.length; i++) tcl[i] = scl[i];
  boxBlurH_4(tcl, scl, w, h, r);
  boxBlurT_4(scl, tcl, w, h, r);
}

function boxBlurH_4(scl: Uint8Array, tcl: Uint8Array, w: number, h: number, r: number) {
  var iarr = 1 / (r + r + 1);
  for (var i = 0; i < h; i++) {
    var ti = i * w, li = ti, ri = ti + r;
    var fv = scl[ti], lv = scl[ti + w - 1], val = (r + 1) * fv;
    for (var j = 0; j < r; j++) val += scl[ti + j];
    for (var j = 0; j <= r; j++) {
      val += scl[ri++] - fv;
      tcl[ti++] = Math.round(val * iarr);
    }
    for (var j = r + 1; j < w - r; j++) {
      val += scl[ri++] - scl[li++];
      tcl[ti++] = Math.round(val * iarr);
    }
    for (var j = w - r; j < w; j++) {
      val += lv - scl[li++];
      tcl[ti++] = Math.round(val * iarr);
    }
  }
}

function boxBlurT_4(scl: Uint8Array, tcl: Uint8Array, w: number, h: number, r: number) {
  var iarr = 1 / (r + r + 1);
  for (var i = 0; i < w; i++) {
    var ti = i, li = ti, ri = ti + r * w;
    var fv = scl[ti], lv = scl[ti + w * (h - 1)], val = (r + 1) * fv;
    for (var j = 0; j < r; j++) val += scl[ti + j * w];
    for (var j = 0; j <= r; j++) {
      val += scl[ri] - fv;
      tcl[ti] = Math.round(val * iarr);
      ri += w;
      ti += w;
    }
    for (var j = r + 1; j < h - r; j++) {
      val += scl[ri] - scl[li];
      tcl[ti] = Math.round(val * iarr);
      li += w;
      ri += w;
      ti += w;
    }
    for (var j = h - r; j < h; j++) {
      val += lv - scl[li];
      tcl[ti] = Math.round(val * iarr);
      li += w;
      ti += w;
    }
  }
}