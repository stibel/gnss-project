import React from "react";
import {NavLink} from "react-router-dom";
import styled, {ThemeProvider} from "styled-components";

import mainTheme from "../styles/main";
import Clock from "./Clock";

const HeaderWrapper = styled.div`
  padding: 0;
  margin: 0;
  height: 10vh;
  width: 100vw;
  display: flex;
  flex-flow: row;
  justify-content: center;
  background-image: linear-gradient(360deg, ${props => props.theme.colours.primary}, ${props => props.theme.colours.details});
`

const NavWrapper = styled.nav`
  padding: 0;
  margin: 0;
  height: 10vh;
  width: 85vw;
  display: flex;
  flex-flow: row;
  justify-content: left;
`

const ItemWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-left: 5%;
  font-weight: bold;
  font-family: ${props => props.theme.fonts.family};
  font-size: ${props => props.theme.fonts.size.xl};

  @keyframes shadow{
    100% {
      text-shadow: 4px 4px ${props => props.theme.colours.details};
    }
  }

  &:hover {
    animation: shadow 0.2s;
    -webkit-animation-fill-mode: forwards;
  }
`

const style = {
    textDecoration: "none",
    color: mainTheme.colours.secondary
}

const activeStyle = {
    textShadow: "4px 4px" + mainTheme.colours.details
}

const ClockWrapper = styled.div`
  width: 15vw;
  display: flex;
  align-items: center;
  justify-content: right;
`


const Header = (props) => {
    return (
        <ThemeProvider theme={mainTheme}>
            <HeaderWrapper>
                <NavWrapper>
                    <ItemWrapper>
                        <NavLink
                            exact to={"/"}
                            style={style}
                            activeStyle={activeStyle}>
                            Strona Główna
                        </NavLink>
                    </ItemWrapper>
                    <ItemWrapper>
                        <NavLink
                            to="/Load"
                            style={style}
                            activeStyle={activeStyle}
                        >
                            Wyznacz datę
                        </NavLink>
                    </ItemWrapper>
                </NavWrapper>
                <ClockWrapper>
                    <Clock />
                </ClockWrapper>
            </HeaderWrapper>
        </ThemeProvider>
    )
}

export default Header