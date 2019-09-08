import React from "react";
import {QuestionIDs, YesNoQuestionIds} from "../common";
import {IQuestion} from "../index";
import {Box, Slider, Typography} from "@material-ui/core";
import {isMainThread} from "worker_threads";
import {AngleMarks} from "./_helpers";

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
            <Typography> Separation intensity </Typography>
            <Slider
              min={0}
              max={0.15}
              value={intensity}
              step={0.01}
              onChange={(e, v) => setExtraData({
                ...extraData,
                intensity: v as number
              })}
            />
            <Typography> Image intensity </Typography>
            <Slider
              min={0}
              max={1}
              value={alpha}
              step={0.05}
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

