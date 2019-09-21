import React from "react";
import {QuestionIDs, YesNoQuestionIds} from "../common";
import {IQuestion} from "../index";
import {Box, Slider, Typography} from "@material-ui/core";
import {isMainThread} from "worker_threads";
import {AngleMarks} from "./_helpers";

import Distance0 from './assets/double-vision/distance0.png'
import Distance50 from './assets/double-vision/distance50.png'
import Distance100 from './assets/double-vision/distance100.png'

import Intensity0 from './assets/double-vision/intensity0.png'
import Intensity25 from './assets/double-vision/intensity25.png'
import Intensity50 from './assets/double-vision/intensity50.png'
import Intensity75 from './assets/double-vision/intensity75.png'
import Intensity100 from './assets/double-vision/intensity100.png'
import {CustomIcon} from "../../../custom-icon";

export interface DoubleVisionQuestionExtraData {
  intensity: number
  angle: number
  alpha: number
}


export const DoubleVisionQuestion: IQuestion<YesNoQuestionIds, DoubleVisionQuestionExtraData> = {
  question: {
    string: "Double vision?",
    id: QuestionIDs.DoubleVision
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
        const angle = extraData ? extraData.angle : 0;
        const alpha = extraData ? extraData.alpha : 0;
        return (
          <Box>
            <Typography> Distance </Typography>
            <Slider
              min={0}
              max={0.15}
              value={intensity}
              step={0.005}
              marks={[
                {value: 0, label: <CustomIcon src={Distance0}/>},
                {value: 0.075, label: <CustomIcon src={Distance50}/>},
                {value: 0.15, label: <CustomIcon src={Distance100}/>}
              ]}
              onChange={(e, v) => setExtraData({
                ...extraData,
                intensity: v as number
              })}
            />
            <Typography> Intensity </Typography>
            <Slider
              min={0}
              max={1}
              value={alpha}
              step={0.05}
              marks={[
                {value: 0, label: <CustomIcon src={Intensity0}/>},
                {value: 0.25, label: <CustomIcon src={Intensity25}/>},
                {value: 0.50, label: <CustomIcon src={Intensity50}/>},
                {value: 0.75, label: <CustomIcon src={Intensity75}/>},
                {value: 1, label: <CustomIcon src={Intensity100}/>},
              ]}
              onChange={(e, v) => setExtraData({
                ...extraData,
                alpha: v as number
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
          </Box>
        )
      }
    }
  ],
  selected: {
    id: YesNoQuestionIds.no,
    extraData: {
      angle: 0,
      intensity: 0.1,
      alpha: 0.5
    }
  },
  effect: (ctx: CanvasRenderingContext2D, {id, extraData}, {original}) => {
    if (id === YesNoQuestionIds.no) {
      return;
    }

    const angle = (extraData && extraData.angle) || 0;
    const intensity = (extraData && extraData.intensity) || 0;
    const alpha = (extraData && extraData.alpha) || 0;
    const canvas = ctx.canvas;

    const intensityPx = Math.min(canvas.width, canvas.height) * intensity;

    const intensityX = Math.floor(Math.sin(angle) * intensityPx);
    const intensityY = Math.floor(Math.cos(angle) * intensityPx);

    ctx.globalAlpha = alpha;
    ctx.drawImage(
      original,
      0, 0,
      original.width, original.height,
      intensityX, intensityY,
      canvas.width, canvas.height
    );
    ctx.globalAlpha = 1;
  }
};

