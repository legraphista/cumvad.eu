import {Collapse, FormControlLabel, GridList, makeStyles, Paper, Radio, RadioGroup} from "@material-ui/core";
import React, {useContext, useState} from "react";
import {QuestionStore} from "./question-store";
import './question.css'
import ArrowDrop from '@material-ui/icons/ArrowDropDownCircleOutlined'
import FormControl from '@material-ui/core/FormControl';
import {observer} from 'mobx-react-lite'
import {QuestionIDs} from "./questions-list/common";
import {QuestionList} from "./questions-list";

const useStyles = makeStyles(theme => ({
  gridList: {
    backgroundColor: theme.palette.background.default,
    padding: '16px',
  },
}));


export const Question = observer(({q_id}: { q_id: QuestionIDs }) => {

  const store = useContext(QuestionStore);

  const questionString = store.questions[q_id].question.string;
  const answers = store.questions[q_id].answers;
  const selected = store.questions[q_id].selected;

  const [opened, setOpened] = useState(false);

  return (
    <Paper className="question" elevation={2}>
      <Paper onClick={() => setOpened(!opened)} elevation={1} className="header">
        <ArrowDrop fontSize={"inherit"} height={'30px'}/>
        <span>{questionString}</span>
      </Paper>
      <Collapse in={opened}>
        <FormControl className="content full-width">
          <RadioGroup
            onChange={(e) => store.setAnswer(q_id, e.target.value)}
            value={selected && selected.id}
          >
            {
              answers.map((a, i) => {
                const ExtraComponent = (
                  selected && selected.id === a.id &&
                  a.extraComponent
                ) ?
                  <a.extraComponent
                    extraData={selected.extraData}
                    setExtraData={(e) => store.setAnswerExtraData(q_id, e)}
                  /> :
                  null;

                return (
                  <div key={i} className="full-width">
                    <FormControlLabel
                      className="full-width"
                      key={a.id.toString()}
                      value={a.id.toString()}
                      control={<Radio/>}
                      label={a.string}
                    />
                    {ExtraComponent}
                  </div>
                )
              })
            }
          </RadioGroup>
        </FormControl>
      </Collapse>
    </Paper>
  );

});

export const Questions = () => {

  const classes = useStyles();

  return (
    <GridList cols={1} className={classes.gridList} cellHeight={'auto'}>
      {
        QuestionList.map((q, i) => <Question key={i} q_id={q.question.id}/>)
      }
    </GridList>
  )

};