import React from "react";
import {QuestionIDs} from "./common";
import {IQuestion} from "./index";
import {Slider} from "@material-ui/core";
import {observer} from "mobx-react-lite";
import {getIntlStrings} from "./intl";

export enum TestQuestionAnswerIDs {
  answer1 = 'a1',
  answer2 = 'a2'
}

export interface TestQuestionExtraData {
  value: number
}

const intl = getIntlStrings<TestQuestionAnswerIDs>({
  ro: {
    question: 'Test Question',
    answers: {
      [TestQuestionAnswerIDs.answer1]: {answer: 'answer1'},
      [TestQuestionAnswerIDs.answer2]: {answer: 'answer2', extra: 'extra question'},
    }
  }
});

export const TestQuestion: IQuestion<TestQuestionAnswerIDs, TestQuestionExtraData> = {
  question: {
    string: intl.question,
    id: QuestionIDs.TestQuestion
  },
  answers: [
    {
      string: intl.answers[TestQuestionAnswerIDs.answer1].answer,
      id: TestQuestionAnswerIDs.answer1
    },
    {
      string: intl.answers[TestQuestionAnswerIDs.answer2].answer,
      id: TestQuestionAnswerIDs.answer2,
      extraComponent: observer(({extraData, setExtraData}) => {
        const value = extraData ? extraData.value : 0;
        return (
          <div>
            <h5> {intl.answers[TestQuestionAnswerIDs.answer2].extra} </h5>
            <Slider
              min={1}
              max={10}
              value={value}
              onChange={(e, v) => setExtraData({value: v as number})}
            /></div>)
      })
    }
  ],
  selected: {
    id: TestQuestionAnswerIDs.answer1
  }
};

