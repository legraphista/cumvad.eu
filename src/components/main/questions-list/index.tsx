import {TestQuestion} from "./test";
import React from "react";
import {QuestionIDs} from "./common";

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
  }
}

export const QuestionList = [
  TestQuestion,
];