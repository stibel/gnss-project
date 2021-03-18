import React from "react";
import {BrowserRouter as Router,
    Switch,
    Route} from "react-router-dom";
import HomeScreen from "./screens/HomeScreen";
import LoadFileScreen from './screens/LoadFileScreen';
import Header from "./components/Header";

const App = () => {
  return (
    <Router>
        <Header/>
        <Switch>
            <Route exact path={"/"}>
                <HomeScreen />
            </Route>
            <Route path={"/Load"}>
                <LoadFileScreen />
            </Route>
        </Switch>
    </Router>
  );
}

export default App;
