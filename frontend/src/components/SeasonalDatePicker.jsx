import { useState, useEffect } from "react";
import { Box, Typography, Button, Collapse } from "@mui/material";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

export default function SeasonalDatePicker({
  label,
  dates,
  setDates,
  openInitially = false,
  disabled = false,
}) {
  const [open, setOpen] = useState(openInitially);
  const [selectedDates, setSelectedDates] = useState(dates.map((d) => new Date(d)));

  // Sync selected dates if parent changes
  useEffect(() => {
    setSelectedDates(dates.map((d) => new Date(d)));
  }, [dates]);

  const handleConfirm = () => {
    setDates(selectedDates.map((d) => d.toISOString().split("T")[0]));
    setOpen(false);
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle1" gutterBottom>
        {label}:{" "}
        {dates.map((date, i) => {
          const d = new Date(date);
          return (
            <span key={i} style={{ marginRight: 6 }}>
              {`${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`}
            </span>
          );
        })}
      </Typography>

      <Button
        variant="outlined"
        size="small"
        onClick={() => setOpen((prev) => !prev)}
        sx={{ mb: 1 }}
        disabled={disabled}
      >
        {open ? "Hide Calendar" : "Select Dates"}
      </Button>

      <Collapse in={open}>
        <DayPicker mode="multiple" selected={selectedDates} onSelect={setSelectedDates} />
        <Button variant="contained" size="small" onClick={handleConfirm} sx={{ mt: 1 }}>
          Done
        </Button>
      </Collapse>
    </Box>
  );
}
