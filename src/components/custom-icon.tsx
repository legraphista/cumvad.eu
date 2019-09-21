import React from "react";
import {makeStyles} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  img: {
    background: theme.palette.background.default,
    width: '1em',
    height: '1em',
    fontSize: '1.5rem',
    flexShrink: 0,
    userSelect: 'none'
  },
  left: {
    transform: 'translate(50%)'
  },
  right: {
    transform: 'translate(-50%)'
  }
}));


export const CustomIcon = ({src, left, right}: {
  src: string, left?: boolean, right?: boolean
}) => {
  const classes = useStyles();

  return (
    <img
      src={src}
      className={[
        classes.img,
        left ? classes.left : '',
        right ? classes.right : ''
      ].join(' ')}
    />
  )

}
