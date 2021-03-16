import styled from "styled-components";

const PageWrapper = styled.main`
  padding: 0;
  margin: 0;
  display: flex;
  flex-flow: row;
  justify-content: left;
  width: 100vw;
  height: 90vh;
  background-image: linear-gradient(180deg, ${props => props.theme.colours.primary}, ${props => props.theme.colours.details});
  font-family: ${props => props.theme.fonts.family};
  font-size: ${props => props.theme.fonts.size.l};
  -webkit-text-fill-color: ${props => props.theme.colours.secondary};
`

export default PageWrapper;