import React from "react";
import {QuestionIDs, YesNoQuestionIds} from "../common";
import {IQuestion} from "../index";
import {Box, Slider, Typography} from "@material-ui/core";


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
    if(id === YesNoQuestionIds.no ){
      return;
    }

    const canvas = ctx.canvas;
    const blur = (extraData && extraData.intensity) || 0;

    canvas.style.filter += ` blur(${blur}px)`;
  }
};

