export interface IIntlQuestion<AnswerEnum extends string> {
  question: string,
  answers: {
    [s in AnswerEnum]: {
      answer: string,
      extra?: string
    }
  }
}

export type Languages = 'ro';

export type IIntlObject<AnswerEnum extends string> = {
  [s in Languages]: IIntlQuestion<AnswerEnum>
}

export const getIntlStrings = <AnswerEnum extends string>(q: IIntlObject<AnswerEnum>): IIntlQuestion<AnswerEnum> => {
  return q['ro'];
};
