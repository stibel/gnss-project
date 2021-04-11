import styled from "styled-components";

const Input = styled.input`
    font-family: ${props => props.theme.fonts.family};
    -webkit-text-fill-color: ${props => props.theme.colours.primary};
    background-color:  ${props => props.theme.colours.secondary};
    height: ${props => props.theme.fonts.m};
    border: 1px solid ${props => props.theme.colours.details};
    margin: 1%;

     &:focus {
       background-color: ${props => props.theme.colours.details};
     }
 `

export default Input
