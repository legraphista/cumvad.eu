import React from "react";
import {QuestionIDs, YesNoQuestionIds} from "../common";
import {IQuestion} from "../index";
import {Box, Slider, Typography} from "@material-ui/core";
import {AngleMarks} from "./_helpers";
import {CustomIcon} from "../../../custom-icon";

import Intensity0 from './assets/chromatic-aberaqtion/intensity0.png';
import Intensity25 from './assets/chromatic-aberaqtion/intensity25.png';
import Intensity50 from './assets/chromatic-aberaqtion/intensity50.png';

import Phase0 from './assets/chromatic-aberaqtion/phase0.png';
import Phase1 from './assets/chromatic-aberaqtion/phase1.png';
import Phase2 from './assets/chromatic-aberaqtion/phase2.png';




export interface ChromaticAberrationQuestionExtraData {
  intensity: number
  phase: number
  angle: number
}


export const ChromaticAberrationQuestion: IQuestion<YesNoQuestionIds, ChromaticAberrationQuestionExtraData> = {
  question: {
    string: "Color separation?",
    id: QuestionIDs.ChromaticAberration
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
        const intensity = extraData ? extraData.intensity : 0;
        const phase = extraData ? extraData.phase : 0;
        const angle = extraData ? extraData.angle : 0;
        return (
          <Box>
            <Typography> Separation intensity </Typography>
            <Slider
              min={0}
              max={15}
              value={intensity}
              marks={[
                {value: 0, label: <CustomIcon src={Intensity0}/>},
                {value: 7.5, label: <CustomIcon src={Intensity25}/>},
                {value: 15, label: <CustomIcon src={Intensity50}/>},
              ]}
              step={1}
              onChange={(e, v) => setExtraData({
                ...extraData,
                intensity: v as number
              })}
            />
            <Typography> Angle </Typography>
            <Slider
              min={0}
              max={Math.PI * 2}
              value={angle}
              step={0.01}
              marks={AngleMarks}
              onChange={(e, v) => setExtraData({
                ...extraData,
                angle: v as number
              })}
            />
            <Typography> Color Separation Type </Typography>
            <Slider
              min={0}
              max={2}
              value={phase}
              step={1}
              marks={[
                {value: 0, label: <CustomIcon src={Phase0}/>},
                {value: 1, label: <CustomIcon src={Phase1}/>},
                {value: 2, label: <CustomIcon src={Phase2}/>},
              ]}
              onChange={(e, v) => setExtraData({
                ...extraData,
                phase: v as number
              })}
            />
          </Box>
        )
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

    const phase = Math.floor((extraData && extraData.phase) || 0);
    const angle = (extraData && extraData.angle) || 0;
    // const subPhase = ((extraData && extraData.phase) || 0) - phase;
    const intensity = Math.floor((extraData && extraData.intensity) || 0);
    const canvas = ctx.canvas;

    const skip = 0;
    const loopI = (skip + 1) * 4;

    console.time('get');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const dataCopy = data.slice();
    console.timeEnd('get');

    const intensityX = Math.floor(Math.sin(angle) * intensity);
    const intensityY = Math.floor(Math.cos(angle) * intensity);

    console.log(Math.sin(angle), Math.cos(angle));
    console.log(intensityX,intensityY);

    const len = data.length;

    console.time('js');

    // if (subPhase === 0) {
    let i = phase;
    let ii = i + intensityX * 4 + (canvas.width * 4 * intensityY);
    for (
      ;
      i < len && ii < len;
      i += loopI, ii += loopI
    ) {
      if (i > 0 && ii > 0 && i < len && ii < len) {
        data[i] = dataCopy[ii];
      }
    }

    // } else {
    //   for (
    //     let i = phase % 4, ii = i + intensity4;
    //     i < len && ii < len;
    //     i += loopI, ii += loopI
    //   ) {
    //     data[i] = data[ii] * (1 - subPhase) + data[ii + 1] * subPhase;
    //     data[i + 4] = data[ii] * (subPhase) + data[ii + 1] * (1 - subPhase);
    //   }
    // }
    console.timeEnd('js');

    console.time('put');
    ctx.putImageData(imageData, 0, 0);
    console.timeEnd('put');
  }
};

