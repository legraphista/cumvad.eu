import {action, observable, toJS} from 'mobx'
import {createContext, Ref, RefObject} from "react";
import {IQuestion, QuestionList} from "./questions-list";
import {QuestionIDs} from "./questions-list/common";
import {renderCanvas} from "./image-result/canvas-render";

class QuestionStoreClass {

  @observable questions: ({ [s in QuestionIDs]: IQuestion<any> }) = QuestionList.reduce<({ [s in QuestionIDs]: IQuestion<any> })>(
    (a, q) => {
      a[q.question.id] = q;
      return a;
    },
    {} as ({ [s in QuestionIDs]: IQuestion<any> })
  );

  @observable showOriginal = false;

  @action setShowOriginal(b: boolean) {
    this.showOriginal = b;
    this._renderCanvas();
  }

  @action setAnswer<AnswerEnum, AnswerExtraData>(q_id: QuestionIDs, a_id: AnswerEnum, extraData?: AnswerExtraData) {
    const question = this.questions[q_id];

    console.log('setting answer to', toJS(question), 'to', a_id);

    question.selected = {
      id: a_id
    };
    if (extraData) {
      question.selected.extraData = {
        ...(question.selected.extraData || {}),
        ...extraData
      }
    }

    this._renderCanvas();
  }

  @action setAnswerExtraData<AnswerExtraData>(q_id: QuestionIDs, extraData: AnswerExtraData) {
    const question = this.questions[q_id];
    question.selected.extraData = extraData;
    this._renderCanvas();
  }

  registeredCanvas: RefObject<HTMLCanvasElement> | null = null;
  registeredImage: HTMLImageElement | null = null;

  private _renderCanvas() {
    requestAnimationFrame(() => {
      if (this.registeredImage && this.registeredCanvas) {
        renderCanvas(this.registeredImage, this.questions, this.registeredCanvas, this.showOriginal)
      }
    });
  }
}

export const QuestionStore = createContext(new QuestionStoreClass());
