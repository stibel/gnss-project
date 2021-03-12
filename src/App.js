import React from "react";
import {BrowserRouter as Router,
    Switch,
    Route} from "react-router-dom";
import HomeScreen from "./screens/HomeScreen";
import LoadFileScreen from './screens/LoadFileScreen';
import CalcTimeScreen from "./screens/CalculateTimeScreen";
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
            <Route path={"/Calc"}>
                <CalcTimeScreen />
            </Route>
        </Switch>
    </Router>
  );
}

export default App;