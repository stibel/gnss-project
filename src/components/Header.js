import React from "react";
import {NavLink} from "react-router-dom";
import styled from "styled-components";
import SkyBG from "react-sky-bg";
import MyClock from "./Clock";

const HeaderWrapper = styled.div`
  padding: 0;
  margin: 0;
  height: 10vh;
  width: 100vw;
  display: flex;
  flex-flow: row;
  justify-content: center;
`

const NavWrapper = styled.nav`
  padding: 0;
  margin: 0;
  height: 10vh;
  width: 95vw;
  display: flex;
  flex-flow: row;
  justify-content: left;
  z-index: 1;
  position: absolute;
`

const ClockWrapper = styled.div`
  width: 5vw;
  display: flex;
  align-items: center;
  justify-content: right;
  position: absolute;
`


const Header = (props) => {
    return (
        <HeaderWrapper>
            <SkyBG />
            <NavWrapper>

            </NavWrapper>
            <ClockWrapper>
                <MyClock />
            </ClockWrapper>
        </HeaderWrapper>
    )
}

export default Header