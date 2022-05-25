import styled from "styled-components";

export const Button = styled.button`
  color: ${(props) => props.color || props.theme.white};
  border: 2px solid ${(props) => props.background || props.theme.primaryDarkBlue};
  width: ${(props) => props.width || "auto"};
  background: ${(props) => props.background || props.theme.primaryDarkBlue};
  background: ${(props) => (props.outline ? "transparent" : props.background)};
  cursor: pointer;
  font-size: ${(props) => props.fontSize || "14px"};
  margin: ${(props) => props.margin || ""};
  padding: 15px 35px;
  border-radius: 12px;
`;
