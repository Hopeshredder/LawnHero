import { useState, useEffect } from "react";
import {
  getYardList,
  getYardGroup,
  removeYard,
  removeYardGroup,
  updateYardGroup,
} from "../Api";
import Button from "@mui/material/Button";
import NewYardModal from "../components/NewYardModal";
import CustomAccordion from "../components/MUIAccordion";
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

  const [editingGroupId, setEditingGroupId] = useState(null);
  const [editingGroupName, setEditingGroupName] = useState("");
  const [confirmGroupOpen, setConfirmGroupOpen] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState(null);

  const [groupToDelete, setGroupToDelete] = useState(null);

  const fetchYards = async () => {
    try {
      const data = await getYardList();
      const normalized = Array.isArray(data)
        ? data.map((y) => ({
            ...y,
            yard_group:
              typeof y.yard_group === "object" && y.yard_group !== null
                ? y.yard_group.id
                : y.yard_group, // keep as number or null
          }))
        : [];
      setYards(normalized);
    } catch (err) {
      setError("Failed to fetch yards");
      setYards([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchYards();
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const groups = await getYardGroup();
      if (Array.isArray(groups)) {
        setGroups(groups);
      } else {
        setGroups([]);
      }
    } catch (err) {
      setError(err.message || "Failed to load yard groups");
      setGroups([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (yardId) => {
    setSelectedYardId(yardId);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedYardId) return;
    try {
      const yardToDelete = yards.find((y) => y.id === selectedYardId);

      await removeYard(selectedYardId);
      await fetchYards();

      if (yardToDelete?.yard_group) {
        const stillHasYards = yards.some(
          (y) =>
            y.yard_group === yardToDelete.yard_group && y.id !== selectedYardId
        );

        if (!stillHasYards) {
          setGroupToDelete({
            id: yardToDelete.yard_group,
            name:
              groups.find((g) => g.id === yardToDelete.yard_group)
                ?.group_name || "Unnamed Group",
          });
        }
      }
    } catch (err) {
      console.error("Failed to delete yard", err);
      alert("Failed to delete yard.");
    } finally {
      setSelectedYardId(null);
    }
  };

  const handleYardCreated = async () => {
    await fetchGroups(); // re-fetch groups so new group names exist
    await fetchYards(); // re-fetch yards
  };

  // Start editing a group
  const handleEditGroup = (group) => {
    setEditingGroupId(group.id);
    setEditingGroupName(group.group_name);
  };

  // Save group name change
  const handleSaveGroupName = async (groupId) => {
    try {
      await updateYardGroup(groupId, { group_name: editingGroupName });
      await fetchGroups(); // refresh groups after update
    } catch (err) {
      alert("Failed to update group name");
    } finally {
      setEditingGroupId(null);
      setEditingGroupName("");
    }
  };

  // Open confirm modal for deleting a group
  const handleDeleteGroupClick = (groupId) => {
    setSelectedGroupId(groupId);
    setConfirmGroupOpen(true);
  };

  // Confirm deletion of group
  const handleConfirmDeleteGroup = async () => {
    if (!selectedGroupId) return;
    try {
      // Optional: backend already handles SET_NULL for yards
      await removeYardGroup(selectedGroupId);
      fetchGroups();
      fetchYards();
    } catch (err) {
      console.error("Failed to delete group", err);
      alert("Failed to delete group.");
    } finally {
      setSelectedGroupId(null);
    }
  };

  return (
    <div className="px-4 sm:px-8 md:px-16 lg:px-24 flex flex-col items-center justify-start min-h-screen">
      <h1>Yards</h1>

      {loading && <p>Loading yards...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <div className="border border-gray-300 rounded-lg p-4 w-full flex flex-col items-center justify-center">
        {/* Groups with yards */}
        {groups.map((group) => {
          const groupYards = yards.filter(
            (yard) => yard.yard_group === group.id
          );

          if (groupYards.length === 0) return null; // skip groups with no yards

          return (
            <CustomAccordion
              key={group.id}
              title={
                editingGroupId === group.id ? (
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault(); // stop default submit
                      await handleSaveGroupName(group.id);
                    }}
                    onClick={(e) => e.stopPropagation()} // stop accordion toggle
                    style={{ width: "100%" }}
                  >
                    <input
                      type="text"
                      value={editingGroupName}
                      autoFocus
                      onChange={(e) => setEditingGroupName(e.target.value)}
                      onBlur={async () => {
                        if (editingGroupName.trim() !== group.group_name) {
                          await handleSaveGroupName(group.id);
                        } else {
                          setEditingGroupId(null); // exit edit mode if nothing changed
                        }
                      }}
                      className="w-full px-2 py-1 rounded border border-gray-300"
                    />
                  </form>
                ) : (
                  group.group_name
                )
              }
              content={
                <div className="space-y-2">
                  {groupYards.map((yard) => (
                    <CustomAccordion
                      key={yard.id}
                      title={yard.yard_name}
                      content={
                        <>
                          <div>Size: {yard.yard_size}</div>
                          <div>Soil: {yard.soil_type}</div>
                          <div>Grass: {yard.grass_type}</div>
                          <div>
                            Group:{" "}
                            {yard.yard_group
                              ? groups.find((g) => g.id === yard.yard_group)
                                  ?.group_name || "Unnamed Group"
                              : "N/A"}
                          </div>
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
                  ))}
                </div>
              }
              actions={
                <div className="flex gap-2">
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleEditGroup(group)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => handleDeleteGroupClick(group.id)}
                  >
                    Delete
                  </Button>
                </div>
              }
            />
          );
        })}

        {/* Yards without a group */}
        {yards.some((yard) => !yard.yard_group) && (
          <CustomAccordion
            key="ungrouped"
            title="Ungrouped Yards"
            content={
              <div className="space-y-2">
                {yards
                  .filter((yard) => !yard.yard_group)
                  .map((yard) => (
                    <CustomAccordion
                      key={yard.id}
                      title={yard.yard_name}
                      content={
                        <>
                          <div>Size: {yard.yard_size}</div>
                          <div>Soil: {yard.soil_type}</div>
                          <div>Grass: {yard.grass_type}</div>
                          <div>
                            Group:{" "}
                            {yard.yard_group
                              ? groups.find((g) => g.id === yard.yard_group)
                                  ?.group_name || "Unnamed Group"
                              : "N/A"}
                          </div>
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
                  ))}
              </div>
            }
          />
        )}

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
        onYardCreated={handleYardCreated}
        yard={editYard}
        groups={groups}
        yards={yards}
      />
      <ConfirmModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        message="Are you sure you want to delete this yard?"
      />
      <ConfirmModal
        open={confirmGroupOpen}
        onClose={() => setConfirmGroupOpen(false)}
        onConfirm={handleConfirmDeleteGroup}
        message="Are you sure you want to delete this group? All yards in this group will be unassigned."
      />
      <ConfirmModal
        open={!!groupToDelete}
        onClose={() => setGroupToDelete(null)}
        onConfirm={async () => {
          if (groupToDelete) {
            await removeYardGroup(groupToDelete.id);
            await fetchGroups();
            setGroupToDelete(null);
          }
        }}
        title="Delete Empty Group?"
        message={`The yard group "${groupToDelete?.name}" is now empty. Do you want to delete it?`}
      />
    </div>
  );
}
