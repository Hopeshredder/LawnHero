import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import { createTask, updateTask } from "../Api";

export default function NewTaskModal({
  open,
  onClose,
  yardId,
  task,
  onTaskSaved,
}) {
  const [activityType, setActivityType] = useState(task?.activity_type || "");
  const [dayScheduled, setDayScheduled] = useState(task?.day_scheduled || "");
  const [dayCompleted, setDayCompleted] = useState(task?.day_completed || "");

  useEffect(() => {
    setActivityType(task?.activity_type || "");
    setDayScheduled(task?.day_scheduled || "");
    setDayCompleted(task?.day_completed || "");
  }, [task]);

  const handleSubmit = async () => {
    if (!activityType || !dayScheduled) {
      alert("Activity Type and Scheduled Date are required.");
      return;
    }

    const payload = {
      activity_type: activityType,
      day_scheduled: dayScheduled,
      day_completed: dayCompleted || null,
    };

    try {
      if (task) {
        // editing existing task
        await updateTask(task.id, payload);
      } else {
        // creating new task
        await createTask(yardId, payload);
      }

      if (onTaskSaved) {
        await onTaskSaved(yardId || task.yard);
      }

      setActivityType("");
      setDayScheduled("");
      setDayCompleted("");
      onClose();
    } catch (err) {
      console.error("Failed to save task:", err);
      alert("Failed to save task");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{task ? "Edit Task" : "New Task"}</DialogTitle>
      <DialogContent className="flex flex-col gap-4 mt-2">
        <TextField
          label="Activity Type"
          value={activityType}
          onChange={(e) => setActivityType(e.target.value)}
          required
          fullWidth
        />
        <TextField
          label="Scheduled Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={dayScheduled}
          onChange={(e) => setDayScheduled(e.target.value)}
          required
          fullWidth
        />
        <TextField
          label="Completed Date (optional)"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={dayCompleted}
          onChange={(e) => setDayCompleted(e.target.value)}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={!activityType || !dayScheduled}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
