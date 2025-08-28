import { useState } from "react";
import { Modal, Box, Typography, TextField, Button } from "@mui/material";
import { createYard } from "../Api";

export default function NewYardModal({ open, onClose, onYardCreated }) {
  const [yardName, setYardName] = useState("");
  const [yardSize, setYardSize] = useState(0);
  const [soilType, setSoilType] = useState("Unknown");
  const [grassType, setGrassType] = useState("Unknown");
  const [yardGroup, setYardGroup] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    // if (!yardName.trim()) {
    //   setError("Yard name is required.");
    //   return;
    // }

    setLoading(true);
    setError("");

    try {
      await createYard({
        yard_name: yardName,
        yard_size: Number(yardSize),
        soil_type: soilType || "Unknown",
        grass_type: grassType || "Unknown",
        yard_group: yardGroup || null,
      });

      setYardName("");
      setYardSize(0);
      setSoilType("Unknown");
      setGrassType("Unknown");
      setYardGroup("");

      onYardCreated();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create yard.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: 300, sm: 400 },
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Add New Yard
        </Typography>

        <TextField
          fullWidth
          label="Yard Name"
          value={yardName}
          onChange={(e) => setYardName(e.target.value)}
          margin="normal"
          disabled={loading}
        />
        <TextField
          fullWidth
          label="Yard Size"
          type="number"
          value={yardSize}
          onChange={(e) => setYardSize(e.target.value)}
          margin="normal"
          disabled={loading}
        />
        <TextField
          fullWidth
          label="Soil Type"
          value={soilType}
          onChange={(e) => setSoilType(e.target.value)}
          margin="normal"
          disabled={loading}
        />
        <TextField
          fullWidth
          label="Grass Type"
          value={grassType}
          onChange={(e) => setGrassType(e.target.value)}
          margin="normal"
          disabled={loading}
        />
        <TextField
          fullWidth
          label="Yard Group"
          value={yardGroup}
          onChange={(e) => setYardGroup(e.target.value)}
          margin="normal"
          disabled={loading}
        />

        {error && <Typography color="error">{error}</Typography>}

        <Box mt={2} display="flex" justifyContent="flex-end" gap={1}>
          <Button variant="outlined" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#a14525",
              "&:hover": { backgroundColor: "#c65b3b" },
            }}
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
