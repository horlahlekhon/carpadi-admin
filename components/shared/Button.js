import { Button } from "@mui/material";

const Btn = ({ text }) => {
  return (
    <Button
      variant="contained"
      sx={{
        marginTop: "32px",
        textTransform: "none",
        width: "372px",
        height: "48px",
        borderRadius: "12px",
      }}
      disableElevation
    >
      {text || "Button"}
    </Button>
  );
};

export default Btn;
