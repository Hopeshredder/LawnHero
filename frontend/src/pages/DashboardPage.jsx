import { useState, useEffect } from "react";
import { getYardList, getYardGroup } from "../Api";
import Button from "@mui/material/Button";
import NewYardModal from "../components/NewYardModal";
import CustomAccordion from "../components/MUIAccordion";
import { removeYard } from "../Api";
import ConfirmModal from "../components/ConfirmModal";

export default function Dashboard() {
  const [yards, setYards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedYardId, setSelectedYardId] = useState(null);
  const [editYard, setEditYard] = useState(null);

  const [groups, setGroups] = useState([]);
  console.log(groups)
  const fetchYards = async () => {
    try {
      const data = await getYardList();
      setYards(data || []);
    } catch (err) {
      setError("Failed to fetch yards");
      setYards([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchYards();
  }, []);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const data = await getYardGroup();
        setGroups(data);
      } catch (err) {
        setError(err.message || "Failed to load yard groups");
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  const handleDeleteClick = (yardId) => {
    setSelectedYardId(yardId);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedYardId) return;
    try {
      await removeYard(selectedYardId);
      fetchYards();
    } catch (err) {
      console.error("Failed to delete yard", err);
      alert("Failed to delete yard.");
    } finally {
      setSelectedYardId(null);
    }
  };

  return (
    <div className="px-4 sm:px-8 md:px-16 lg:px-24 flex flex-col items-center justify-start min-h-screen">
      <h1>Yards</h1>

      {loading && <p>Loading yards...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <div className="border border-gray-300 rounded-lg p-4 w-full flex flex-col items-center justify-center">
        <div className="w-full space-y-4 pb-8 flex flex-col">
          {yards.length > 0 ? (
            yards.map((yard) => (
              <CustomAccordion
                key={yard.id}
                title={yard.yard_name}
                content={
                  <>
                    <div>Size: {yard.yard_size}</div>
                    <div>Soil: {yard.soil_type}</div>
                    <div>Grass: {yard.grass_type}</div>
                    <div>Group: {yard.yard_group || "N/A"}</div>
                  </>
                }
                actions={
                  <div className="flex gap-2">
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => setEditYard(yard)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => handleDeleteClick(yard.id)}
                    >
                      Delete
                    </Button>
                  </div>
                }
              />
            ))
          ) : (
            <p>{error || "No yards found."}</p>
          )}
        </div>

        <Button
          variant="contained"
          sx={{
            backgroundColor: "#a14525",
            "&:hover": { backgroundColor: "#c65b3b" },
            maxWidth: "45%",
            mt: 2,
          }}
          onClick={() => setModalOpen(true)}
        >
          New Yard
        </Button>
      </div>
      <NewYardModal
        open={!!editYard || modalOpen}
        onClose={() => {
          setEditYard(null);
          setModalOpen(false);
        }}
        onYardCreated={fetchYards}
        yard={editYard}
      />
      <ConfirmModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        message="Are you sure you want to delete this yard?"
      />
    </div>
  );
}
