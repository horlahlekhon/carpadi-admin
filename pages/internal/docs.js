import { Button } from "../../components/shared/Button";
import { theme } from "../../styles/theme.config";
import classes from "../../styles/Docs.module.css";
import Input from "../../components/shared/Input";
import Checkbox from "../../components/shared/Checkbox";
import ToggleSwitch from "../../components/shared/ToggleSwitch";
import { useState } from "react";

function DocsPage() {
  const [value, setCheckbox] = useState(true);
  return (
    <div className={classes.main}>
      <h1>Docs</h1>
      <div>
        <h3>Buttons</h3>
        <Button margin={"0 0 5px 0"}>Regular Button</Button>
        <Button
          margin={"0 0 5px 5px"}
          outline={true}
          color={theme.primaryDarkBlue}
        >
          Outline Button
        </Button>
        <Button
          width={"100%"}
          background={theme.primaryBlue}
          margin={"0 0 5px 0"}
        >
          Full Width Button
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
  );
}

export default DocsPage;
