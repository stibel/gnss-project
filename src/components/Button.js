import React from 'react'
import styled, {keyframes} from "styled-components";
import globe from "../images/FP_Satellite_icon.svg";

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(360deg);
  }
  100% {
    transform: rotate(0deg);
  }
`


const ImageWrapper = styled.img`
  width: 80%;
  z-index: 5;
  animation: infinite 10s ${spin} linear;

  @keyframes jump{
    50% {
      width: 60%;
    }
    75% {
      width: 100%;
    }
    100% {
      width: 80%;
    }
  }
  
  &:hover {
  animation: jump 0.5s;
  -webkit-animation-fill-mode: forwards;
  }
`

const ButtonWrapper = styled.div`
  width: 20vw;
  height: 20vw;
  margin-left: 0.5%;
  position: absolute;
  display: flex;
  border: solid 0.25vh ${props => props.theme.colours.details};
  border-radius: 50%;
  align-self: center;
  justify-content: center;
  align-items: center;
  background-color: ${props => props.theme.colours.secondary};
  z-index: 2;

  @keyframes change{
    100% {
      -webkit-text-fill-color: ${props => props.theme.colours.secondary};
      background-color: ${props => props.theme.colours.details};
      border: solid 0.25vh ${props => props.theme.colours.secondary};
    }
  }
  
  &:hover {
    cursor: pointer;
    animation: change 0.5s;
    -webkit-animation-fill-mode: forwards;
    
  }
  
`

const Button = props => {


    return (
            <ButtonWrapper onClick={props.onClick}><ImageWrapper src={globe} alt={"globe"} /></ButtonWrapper>
    )
}

export default Button;