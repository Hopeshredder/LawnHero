import { TextField } from "@mui/material";

export default function NumericInputField({
  label,
  value,
  onChange,
  disabled = false,
  step,
  type = "number",
  inputProps,
}) {
  return (
    <TextField
      label={label}
      type={type}
      step={step}
      value={value}
      onChange={(e) => onChange(type === "number" ? parseFloat(e.target.value) : e.target.value)}
      fullWidth
      disabled={disabled}
      inputProps={inputProps}
      InputLabelProps={{
        sx: {
          whiteSpace: "normal",
          overflow: "visible",
          textOverflow: "clip",
          lineHeight: "1.2em",
        },
      }}
    />
  );
}
