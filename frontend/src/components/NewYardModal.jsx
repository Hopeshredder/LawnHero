import { useState, useEffect } from "react";
import { Modal, Box, Typography, TextField, Button } from "@mui/material";
import { createYard, updateYard } from "../Api";

export default function NewYardModal({ open, onClose, onYardCreated, yard }) {
  const [yardName, setYardName] = useState(yard?.yard_name || "");
  const [yardSize, setYardSize] = useState(yard?.yard_size || 0);
  const [soilType, setSoilType] = useState(yard?.soil_type || "Unknown");
  const [grassType, setGrassType] = useState(yard?.grass_type || "Unknown");
  const [yardGroup, setYardGroup] = useState(yard?.yard_group || "");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (yard) {
      setYardName(yard.yard_name);
      setYardSize(yard.yard_size);
      setSoilType(yard.soil_type);
      setGrassType(yard.grass_type);
      setYardGroup(yard.yard_group || "");
    }
  }, [yard]);

  const handleSave = async () => {
    if (!yardName.trim()) {
      setError("Yard name is required.");
      return;
    }
    if (Number(yardSize) < 0) {
      setError("Yard size must be 0 or greater.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      if (yard?.id) {
        // if yard already has an ID, edit yard
        await updateYard(yard.id, {
          yard_name: yardName,
          yard_size: Number(yardSize),
          soil_type: soilType || "Unknown",
          grass_type: grassType || "Unknown",
          yard_group: yardGroup || null,
        });
      } else {
        // create yard
        await createYard({
          yard_name: yardName,
          yard_size: Number(yardSize),
          soil_type: soilType || "Unknown",
          grass_type: grassType || "Unknown",
          yard_group: yardGroup || null,
        });
      }

      setYardName("");
      setYardSize(0);
      setSoilType("Unknown");
      setGrassType("Unknown");
      setYardGroup("");

      onYardCreated();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save yard.");
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
          width: { xs: "90%", sm: 400 },
          bgcolor: "#f9f0dd",
          borderRadius: 8,
          boxShadow: 6,
          p: { xs: 3, sm: 4 },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" gutterBottom sx={{ mb: 2, color: "#333" }}>
          {yard?.id ? "Edit Yard" : "Add New Yard"}
        </Typography>

        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <TextField
            fullWidth
            label="Yard Name"
            value={yardName}
            onChange={(e) => setYardName(e.target.value)}
            disabled={loading}
          />
          <TextField
            fullWidth
            label="Yard Size"
            type="number"
            value={yardSize}
            onChange={(e) => setYardSize(e.target.value)}
            disabled={loading}
            inputProps={{ min: 0 }}
          />
          <TextField
            fullWidth
            label="Soil Type"
            value={soilType}
            onChange={(e) => setSoilType(e.target.value)}
            disabled={loading}
          />
          <TextField
            fullWidth
            label="Grass Type"
            value={grassType}
            onChange={(e) => setGrassType(e.target.value)}
            disabled={loading}
          />
          <TextField
            fullWidth
            label="Yard Group"
            value={yardGroup}
            onChange={(e) => setYardGroup(e.target.value)}
            disabled={loading}
          />
        </Box>

        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}

        <Box
          mt={3}
          display="flex"
          justifyContent="flex-end"
          gap={2}
          sx={{ width: "100%" }}
        >
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
