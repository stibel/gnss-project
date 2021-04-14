import React from "react";
import {BrowserRouter as Router,
        Switch,
        Route} from "react-router-dom";
import HomeScreen from "./screens/HomeScreen";
import LoadFileScreen from './screens/LoadFileScreen';
import ChartsScreen from "./screens/ChartsScreen";
import Header from "./components/Header";

import mainTheme from "./styles/main";
import {ThemeProvider} from "styled-components";

const App = () => {
  return (
    <ThemeProvider theme = {mainTheme}>
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
    </ThemeProvider>
  );
}

export default App;
