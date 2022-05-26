import { theme } from "../../styles/theme.config";
import classes from "../../styles/Docs.module.css";
import Input from "../../components/shared/Input";
import Checkbox from "../../components/shared/Checkbox";
import ToggleSwitch from "../../components/shared/ToggleSwitch";
import { useState } from "react";
import styled from "styled-components";
import DeleteIcon from "@mui/icons-material/Delete";
import { Button } from "@mui/material";

function DocsPage() {
  const [value, setCheckbox] = useState(true);
  return (
    <Container>
      <div className={classes.main}>
        <h1>Docs</h1>
        <div>
          <h3>Buttons</h3>
          <Button variant="contained" size="large">Regular Button</Button>
          <Button variant="outlined" color={theme.primaryDarkBlue}>
            Outline Button
          </Button>
          <Button variant="outlined" color={theme.primaryDarkBlue} startIcon={<DeleteIcon/>}>
            Outline Button
          </Button>
        </div>
        <div>
          <h3>Inputs</h3>
          <Input
            label={"Password"}
            type={"password"}
            placeholder="Enter Password"
            margin={"0 5px 0 0"}
          ></Input>
          <Input type={"email"} placeholder="Enter Email"></Input>
        </div>
        <div>
          <h3>Checkboxes</h3>
          <Checkbox
            margin={"10px 0 0 0"}
            value={value}
            checked={value}
            onChange={({ target }) => setCheckbox(!value)}
          />
          <Checkbox
            margin={"10px 0 0 10px"}
            value={value}
            checked={value}
            onChange={({ target }) => setCheckbox(!value)}
            disabled={true}
          />
        </div>
        <div>
          <h3>Toggle Switches</h3>
          <ToggleSwitch
            value={value}
            checked={value}
            onChange={({ target }) => setCheckbox(!value)}
          />

          <ToggleSwitch
            disabled={true}
            value={value}
            checked={value}
            onChange={({ target }) => setCheckbox(!value)}
          />
        </div>
      </div>
    </Container>
  );
}

const Container = styled.div`
  width: 90vw !important;
  height: 100vh;
  margin: 2rem auto;
  padding: 2rem;
  background: #f2f2f2;
`;

export default DocsPage;
