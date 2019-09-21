import React from "react";
import {QuestionIDs, YesNoQuestionIds} from "../common";
import {IQuestion} from "../index";
import {Box, Icon, Slider, Typography} from "@material-ui/core";
import Blur0 from './assets/blur/0.png';
import Blur50 from './assets/blur/50.png';
import Blur100 from './assets/blur/100.png';
import {CustomIcon} from "../../../custom-icon";

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
              className={''}
              marks={[
                {
                  value: 0,
                  label: <CustomIcon src={Blur0}/>
                },
                {
                  value: 2.5,
                  label: <CustomIcon src={Blur50}/>
                },
                {
                  value: 5,
                  label: <CustomIcon src={Blur100}/>
                }
              ]}
              onChange={(e, v) => setExtraData({intensity: v as number})}
            /></Box>)
      }
    }
  ],
  selected: {
    id: YesNoQuestionIds.no
  },
  effect: (ctx: CanvasRenderingContext2D, {id, extraData}, {original}) => {
    if (id === YesNoQuestionIds.no) {
      return;
    }

    const canvas = ctx.canvas;
    const blur = (extraData && extraData.intensity) || 0;

    // canvas.style.filter += ` blur(${blur}px)`;

    ctx.filter = `blur(${blur}px)`;
    ctx.drawImage(
      original,
      0, 0,
      original.width, original.height,
      0, 0,
      canvas.width, canvas.height
    );
    ctx.filter = 'none';
  }
};

