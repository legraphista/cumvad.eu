import React from 'react';
import './App.css';
import {BrowserRouter as Router, Route} from "react-router-dom";
import {Main} from "./components/main";

function App() {
  return (
    <Router>
      {/*<div>*/}
      {/*  <ul>*/}
      {/*    <li>*/}
      {/*      <Link to="/">Home</Link>*/}
      {/*    </li>*/}
      {/*    <li>*/}
      {/*      <Link to="/about">About</Link>*/}
      {/*    </li>*/}
      {/*    <li>*/}
      {/*      <Link to="/topics">Topics</Link>*/}
      {/*    </li>*/}
      {/*  </ul>*/}

      {/*  <hr />*/}

      <Route exact path="/" component={Main}/>
      <Route path="/about" component={() => <strong>About</strong>}/>
      <Route path="/topics" component={() => <strong>Topics</strong>}/>
      {/*</div>*/}
    </Router>
  );
}

export default App;
