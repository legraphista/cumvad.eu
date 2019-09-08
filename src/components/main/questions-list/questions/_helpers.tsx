import {Mark} from "@material-ui/core/Slider";
import ArrowDown from "@material-ui/icons/ArrowDownward"
import ArrowUp from "@material-ui/icons/ArrowUpward"
import ArrowLeft from "@material-ui/icons/ArrowBack"
import ArrowRight from "@material-ui/icons/ArrowForward"
import React from "react";

export const AngleMarks: Mark[] = [
  {value: 0, label: <ArrowDown/>},
  {value: Math.PI / 2, label: <ArrowRight/>},
  {value: Math.PI, label: <ArrowUp/>},
  {value: 3 * Math.PI / 2, label: <ArrowLeft/>},
  {value: 2 * Math.PI, label: <ArrowDown/>},
];