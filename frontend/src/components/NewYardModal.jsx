import { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  createYard,
  updateYard,
  createYardGroup,
  addYardToYardGroup,
  removeYardGroup,
} from "../Api";
import ConfirmModal from "../components/ConfirmModal";
import MapMyYard from "./MapMyYard";

export default function NewYardModal({
  open,
  onClose,
  onYardCreated,
  yard,
  groups,
  yards,
  setPreferencesOpen,
  setSelectedYardId,
}) {
  const [yardName, setYardName] = useState(yard?.yard_name || "");
  const [yardSize, setYardSize] = useState(yard?.yard_size || 0);
  const [soilType, setSoilType] = useState(yard?.soil_type || "Unknown");
  const [grassType, setGrassType] = useState(yard?.grass_type || "Unknown");
  const [zipCode, setzipCode] = useState(yard?.zip_code || "");
  const [latitude, setLatitude] = useState(yard?.latitude || "");
  const [longitude, setLongitude] = useState(yard?.longitude || "");
  const [yardGroup, setYardGroup] = useState(yard?.yard_group ?? "");
  const [newGroupName, setNewGroupName] = useState("");
  const [availableGroups, setAvailableGroups] = useState(groups);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [confirmGroupOpen, setConfirmGroupOpen] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState(null);

  const [customizePrefs, setCustomizePrefs] = useState(false);

  const [mapOpen, setMapOpen] = useState(false);

  // Sync modal fields when editing a yard
  useEffect(() => {
    if (yard) {
      setYardName(yard.yard_name);
      setYardSize(yard.yard_size);
      setSoilType(yard.soil_type);
      setGrassType(yard.grass_type);
      setzipCode(yard.zip_code);
      setYardGroup(yard?.yard_group ?? "");
      setNewGroupName("");
      if (yard.zip_code && (!yard.latitude || !yard.longitude)) {
        fetchLatLonFromZip(yard.zip_code)
          .then(({ latitude, longitude }) => {
            setLatitude(latitude);
            setLongitude(longitude);
          })
          .catch((err) => console.error("Failed to get lat/lon:", err));
      } else {
        setLatitude(yard.latitude);
        setLongitude(yard.longitude);
      }
    } else {
      setYardName("");
      setYardSize(0);
      setSoilType("Unknown");
      setGrassType("Unknown");
      setzipCode("");
      setYardGroup("");
      setNewGroupName("");
    }
  }, [yard, open]);

  useEffect(() => {
    setAvailableGroups(groups);
  }, [groups]);

  const handleSave = async () => {
    if (!yardName.trim()) {
      setError("Yard name is required.");
      return;
    }
    if (Number(yardSize) < 0) {
      setError("Yard size must be 0 or greater.");
      return;
    }

    if (!/^\d{5}$/.test(zipCode)) {
      setError("Zip code must be exactly 5 digits.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Determine the final group ID
      let finalGroupId = yardGroup === "" ? null : yardGroup;
      const oldGroupId = yard?.yard_group ?? null;

      if (newGroupName?.trim()) {
        const newGroup = await createYardGroup(newGroupName.trim());
        finalGroupId = newGroup.id;
        setAvailableGroups((prev) => [...prev, newGroup]); // add new group to dropdown
        setYardGroup(newGroup.id);
      }

      const payload = {
        yard_name: yardName,
        yard_size: Number(yardSize),
        soil_type: soilType || "Unknown",
        grass_type: grassType || "Unknown",
        zip_code: zipCode || "",
        latitude: latitude,
        longitude: longitude,
        yard_group: finalGroupId,
      };

      // Save or update yard
      let savedYard;
      if (yard?.id) {
        savedYard = await updateYard(yard.id, payload);
      } else {
        savedYard = await createYard(payload);
      }

      // Ensure yard is added to the selected group
      if (finalGroupId) {
        await addYardToYardGroup(finalGroupId, savedYard.id);
      }

      if (oldGroupId && oldGroupId.toString() !== finalGroupId?.toString()) {
        const oldGroupYards = yards.filter(
          (y) =>
            y.yard_group?.toString() === oldGroupId.toString() &&
            y.id !== yard.id
        );

        if (oldGroupYards.length === 0) {
          setGroupToDelete(oldGroupId);
          setConfirmGroupOpen(true);
          return;
        }
      }

      if (!yard?.id) {
        // Reset form
        setYardName("");
        setYardSize(0);
        setSoilType("Unknown");
        setGrassType("Unknown");
        setzipCode("Unknown");
        setYardGroup("");
        setNewGroupName("");
      }

      if (customizePrefs) {
        setSelectedYardId(savedYard.id);
        onClose();
        setPreferencesOpen(true);
      } else {
        onYardCreated();
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save yard.");
    } finally {
      setLoading(false);
    }
  };

  async function fetchLatLonFromZip(zipCode) {
    const res = await fetch(`https://api.zippopotam.us/us/${zipCode}`);
    if (!res.ok) {
      throw new Error("Could not fetch coordinates for ZIP");
    }
    const data = await res.json();
    const place = data.places?.[0];
    return {
      latitude: parseFloat(place.latitude),
      longitude: parseFloat(place.longitude),
    };
  }

  const handleZipChange = async (e) => {
    const val = e.target.value;
    if (/^\d{0,5}$/.test(val)) {
      setzipCode(val);

      // Only fetch when 5 digits are entered
      if (val.length === 5) {
        try {
          const coords = await fetchLatLonFromZip(val);
          setLatitude(coords.latitude);
          setLongitude(coords.longitude);
        } catch (err) {
          console.error("Failed to resolve ZIP code:", err);
        }
      }
    }
  };

  const handleConfirmGroupDelete = async () => {
    if (!groupToDelete) return;
    try {
      await removeYardGroup(groupToDelete);
      setGroupToDelete(null);
      onYardCreated();
      onClose();
    } catch (err) {
      setError("Failed to delete group");
    } finally {
      setConfirmGroupOpen(false);
    }
  };

  return (
    <>
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
              id="yardNameInput"
              fullWidth
              label="Yard Name"
              value={yardName}
              onChange={(e) => setYardName(e.target.value)}
              disabled={loading}
              multiline
              minRows={1}
              maxRows={4}
            />
            <TextField
              id="zipCodeInput"
              fullWidth
              label="Zip Code"
              value={zipCode}
              onChange={handleZipChange}
              disabled={loading}
              inputProps={{ maxLength: 5 }}
            />
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#a14525",
                "&:hover": { backgroundColor: "#c65b3b" },
              }}
              onClick={() => setMapOpen(true)}
              disabled={loading}
            >
              Map My Yard
            </Button>
            <TextField
              fullWidth
              id="yardSizeInput"
              label="Yard Size (sqft)"
              type="number"
              value={yardSize}
              onChange={(e) => setYardSize(e.target.value)}
              disabled={loading}
              inputProps={{ min: 0 }}
            />
            <TextField
              fullWidth
              id='soilTypeInput'
              label="Soil Type"
              value={soilType}
              onChange={(e) => setSoilType(e.target.value)}
              disabled={loading}
              multiline
              minRows={1}
              maxRows={3}
            />
            <TextField
              fullWidth
              id="grassTypeInput"
              label="Grass Type"
              value={grassType}
              onChange={(e) => setGrassType(e.target.value)}
              disabled={loading}
              multiline
              minRows={1}
              maxRows={3}
            />
            <FormControl fullWidth disabled={loading}>
              <InputLabel id="yard-group-label">Yard Group</InputLabel>
              <Select
                labelId="yard-group-label"
                value={yardGroup === "" ? "" : yardGroup}
                onChange={(e) => {
                  setYardGroup(e.target.value);
                  setNewGroupName(""); // clear new group input if selecting existing
                }}
              >
                <MenuItem id='groupNA' value="">N/A</MenuItem>
                {availableGroups.map((group) => (
                  <MenuItem key={group.id} value={group.id.toString()}>
                    {group.group_name || "Unnamed Group"}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              id='newGroupInput'
              label="Or create new group"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              disabled={loading}
            />
          </Box>

          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}

          <div className="mt-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={customizePrefs}
                onChange={(e) => setCustomizePrefs(e.target.checked)}
              />
              <span className="text-sm text-gray-700">
                Customize yard preferences after creation (otherwise defaults
                will be applied)
              </span>
            </label>
          </div>
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
              {loading ? "Saving..." : customizePrefs ? "Next" : "Save"}
            </Button>
          </Box>
        </Box>
      </Modal>
      <Modal open={mapOpen} onClose={() => setMapOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            height: "80%",
            bgcolor: "white",
            p: 2,
            display: "flex",
            flexDirection: "column", // stack map and button vertically
          }}
        >
          <Box sx={{ flex: 1 }}>
            <MapMyYard
              latitude={latitude}
              longitude={longitude}
              onPolygonComplete={({ latLngs, area }) => {
                setYardSize(Math.round(area * 10.7639)); // sqm → sqft
              }}
            />
          </Box>

          <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#a14525",
                "&:hover": { backgroundColor: "#c65b3b" },
              }}
              onClick={() => setMapOpen(false)}
            >
              Finish
            </Button>
          </Box>
        </Box>
      </Modal>

      <ConfirmModal
        open={confirmGroupOpen}
        onClose={() => setConfirmGroupOpen(false)}
        onConfirm={handleConfirmGroupDelete}
        message={`The yard group "${groupToDelete?.name}" is now empty. Do you want to delete it?`}
      />
    </>
  );
}
