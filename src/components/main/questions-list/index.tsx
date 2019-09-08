import React from "react";
import {QuestionIDs} from "./common";
import {BlurQuestion} from "./questions/blur";
import {ChromaticAberrationQuestion} from "./questions/chromatic-aberration";
import {DoubleVisionQuestion} from "./questions/double-vision";

export interface IQuestion<AnswerEnum, AnswerExtraData = any> {
  question: {
    string: string,
    id: QuestionIDs
  },
  answers: {
    string: string,
    id: AnswerEnum
    extraComponent?: React.FunctionComponent<{ extraData: AnswerExtraData, setExtraData: (e: AnswerExtraData) => void }>
  }[],
  selected: {
    id: AnswerEnum,
    extraData?: AnswerExtraData
  },
  effect: (
    ctx: CanvasRenderingContext2D,
    data: { id: AnswerEnum, extraData?: AnswerExtraData },
    extra: {
      original: HTMLImageElement
    }
  ) => void
}

export const QuestionList = [
  BlurQuestion,
  ChromaticAberrationQuestion,
  DoubleVisionQuestion,
];