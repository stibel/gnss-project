import styled from "styled-components";

const Input = styled.input`
  
    -webkit-text-fill-color: ${props => props.theme.colours.primary};
    background-color:  ${props => props.theme.colours.secondary};
    border: 1px solid ${props => props.theme.colours.details};
    margin: 1%;

     &:focus {
       background-color: ${props => props.theme.colours.details};
     }
 `

export default Input
