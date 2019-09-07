import {action, observable, toJS} from 'mobx'
import {createContext} from "react";
import {IQuestion, QuestionList} from "./questions-list";
import {QuestionIDs} from "./questions-list/common";

class QuestionStoreClass {

  // @observable questions-list: ({ [s in QuestionIDs]: IQuestion<any> }) = {
  //     [QuestionIDs.TestQuestion]: TestQuestion
  // };
  @observable questions: ({ [s in QuestionIDs]: IQuestion<any> }) = QuestionList.reduce<({ [s in QuestionIDs]: IQuestion<any> })>(
    (a, q) => {
      a[q.question.id] = q;
      return a;
    },
    {} as ({ [s in QuestionIDs]: IQuestion<any> })
  );

  @action setAnswer<AnswerEnum>(q_id: QuestionIDs, a_id: AnswerEnum) {
    const question = this.questions[q_id];

    console.log('setting answer to', toJS(question), 'to', a_id);

    question.selected = {
      id: a_id
    }
  }

  @action setAnswerExtraData<AnswerExtraData>(q_id: QuestionIDs, extraData: AnswerExtraData) {
    const question = this.questions[q_id];
    question.selected.extraData = extraData;
  }
}

export const QuestionStore = createContext(new QuestionStoreClass());
