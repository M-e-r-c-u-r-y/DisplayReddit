import React from "react";
import {
  Link,
  BrowserRouter as Router,
  Route,
  Redirect,
} from "react-router-dom";
import "./App.css";
import FetchBackendData from "./components/FetchBackendData";
import DisplayBackendData from "./components/DisplayBackendData";

const App = () => {
  return (
    <div className="App">
      <Router>
        <Link style={{ fontSize: "x-large" }} to="/">
          Home
        </Link>
        <Route exact path="/" component={FetchBackendData} />
        <Route path="/data" component={DisplayBackendData} />
        <Route render={() => <Redirect to={{ pathname: "/" }} />} />
      </Router>
    </div>
  );
};

export default App;
