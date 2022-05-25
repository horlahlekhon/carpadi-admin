import React from "react";
import styled from "styled-components";

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 0.3rem;

  &:focus,
  &:active,
  &:focus-within {
    label {
      opacity: 1 !important;
      color: #56a0d7;
      display: inline-flex;
    }
  }
`;

const InputLabel = styled.label`
  opacity: 0;
  display: none;
`;

const InputField = styled.input`
  font-size: 14px;
  height: 38px;
  width: 372px;
  background: ${(props) => props.color || props.theme.white};
  border-style: solid;
  border-width: ${(props) => props.borderWidth || "0"};
  border-bottom: ${(props) => props.borderBottom || "solid 2px"};
  border-color: ${(props) => props.borderColor || props.theme.primaryDarkBlue};
  border-radius: ${(props) => props.radius || ""};
  margin: ${(props) => props.margin || ""};
  transition: 1s;

  &:focus,
  &:active {
    &::placeholder {
      opacity: 0;
    }
    outline: none;
  }

  &::placeholder {
    font-size: 16px;
    position: absolute;
    bottom: 2px;
    color: black;
  }
`;

const Input = ({ id, label, ...rest }) => {
  return (
    <InputGroup>
      <InputLabel htmlFor={id}>{label}</InputLabel>
      <InputField id={id} {...rest} />
    </InputGroup>
  );
};

export default Input;
