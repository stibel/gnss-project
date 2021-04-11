import styled from "styled-components";

const Button = styled.div`
  padding: 0;
  margin: 1vw;
  width: 6vw;
  height: 6vw;
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: center;
  font-size: ${props => props.theme.fonts.size.s};
  font-family: ${props => props.theme.fonts.family};
  -webkit-text-fill-color: ${props => props.theme.colours.details};
  background-color: ${props => props.theme.colours.secondary};
  border: solid 0.25vh ${props => props.theme.colours.details};
  border-radius: 100%;
  cursor: pointer;

  @keyframes change{
    100% {
      -webkit-text-fill-color: ${props => props.theme.colours.secondary};
      background-color: ${props => props.theme.colours.details};
      border: solid 0.25vh ${props => props.theme.colours.secondary};
    }
  }
  
  &:hover {
    animation: change 0.5s;
    -webkit-animation-fill-mode: forwards;
  }
`

export default Button
