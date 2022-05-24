import { Button } from "../../components/shared/Button";
import { theme } from "../../styles/theme.config";
import classes from "../../styles/Docs.module.css";

function DocsPage() {
  return (
    <div className={classes.main}>
      <h1>Docs</h1>
      <Button margin={'0 0 5px 0'}>Regular Button</Button>
      <Button width={'100%'} background={theme.primaryBlue} margin={'0 0 5px 0'}>Full Width Button</Button>
    </div>
  );
}

export default DocsPage;
