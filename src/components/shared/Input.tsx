import TextField from "@material-ui/core/TextField";

const Input = ({ id, label, disabled, required, type, variant, error }) => {
  return (
    <TextField
      error={error || false}
      disabled={disabled || false}
      required={required || false}
      id={id || "standard-basic"}
      label={label || "Standard"}
      type={type || "text"}
      variant={variant || "standard"}
    />
  );
};

export default Input;
