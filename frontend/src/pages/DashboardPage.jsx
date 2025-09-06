import { useState, useEffect } from "react";
import {
  getYardList,
  getYardGroup,
  removeYard,
  removeYardGroup,
  updateYardGroup,
  getPrefs,
} from "../Api";
import Button from "@mui/material/Button";
import NewYardModal from "../components/NewYardModal";
import ConfirmModal from "../components/ConfirmModal";
import PreferencesModal from "../components/PreferencesModal";
import GroupAccordion from "../components/GroupAccordion";

export default function Dashboard() {
  const [yards, setYards] = useState([]);
  const [groups, setGroups] = useState([]);
  const [prefsByYard, setPrefsByYard] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editYard, setEditYard] = useState(null);
  const [selectedYardId, setSelectedYardId] = useState(null);
  const [preferencesOpen, setPreferencesOpen] = useState(false);

  const [editingGroupId, setEditingGroupId] = useState(null);
  const [editingGroupName, setEditingGroupName] = useState("");

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmGroupOpen, setConfirmGroupOpen] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [groupToDelete, setGroupToDelete] = useState(null);

  // Fetch yards
  const fetchYards = async () => {
    try {
      const data = await getYardList();
      setYards(
        Array.isArray(data)
          ? data.map((y) => ({ ...y, yard_group: y.yard_group?.id ?? y.yard_group }))
          : []
      );
    } catch {
      setError("Failed to fetch yards");
      setYards([]);
    }
  };

  // Fetch groups
  const fetchGroups = async () => {
    try {
      const data = await getYardGroup();
      setGroups(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to load yard groups");
      setGroups([]);
    }
  };

  // Fetch preferences for all yards
  const fetchAllPrefs = async () => {
    const prefsArray = await Promise.all(
      yards.map(async (yard) => {
        try {
          const res = await getPrefs(yard.id);
          return res.ok ? [yard.id, res.data] : null;
        } catch {
          return null;
        }
      })
    );
    setPrefsByYard(Object.fromEntries(prefsArray.filter(Boolean)));
  };

  // Initial load
  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([fetchYards(), fetchGroups()]);
      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (yards.length) fetchAllPrefs();
  }, [yards]);

  const handleYardCreated = async () => {
    await Promise.all([fetchYards(), fetchGroups()]);
  };

  const handleDeleteClick = (yardId) => setSelectedYardId(yardId) && setConfirmOpen(true);

  const handleConfirmDelete = async () => {
    if (!selectedYardId) return;
    try {
      const yardToDelete = yards.find((y) => y.id === selectedYardId);
      await removeYard(selectedYardId);
      await fetchYards();

      if (yardToDelete?.yard_group) {
        const stillHasYards = yards.some(
          (y) => y.yard_group === yardToDelete.yard_group && y.id !== selectedYardId
        );
        if (!stillHasYards) {
          setGroupToDelete({
            id: yardToDelete.yard_group,
            name: groups.find((g) => g.id === yardToDelete.yard_group)?.group_name ?? "Unnamed Group",
          });
        }
      }
    } catch {
      alert("Failed to delete yard.");
    } finally {
      setSelectedYardId(null);
    }
  };

  const handleSaveGroupName = async (groupId) => {
    try {
      await updateYardGroup(groupId, { group_name: editingGroupName });
      await fetchGroups();
    } catch {
      alert("Failed to update group name");
    } finally {
      setEditingGroupId(null);
      setEditingGroupName("");
    }
  };

  const handleDeleteGroupClick = (groupId) => {
    setSelectedGroupId(groupId);
    setConfirmGroupOpen(true);
  };

  const handleConfirmDeleteGroup = async () => {
    if (!selectedGroupId) return;
    try {
      await removeYardGroup(selectedGroupId);
      await Promise.all([fetchYards(), fetchGroups()]);
    } catch {
      alert("Failed to delete group.");
    } finally {
      setSelectedGroupId(null);
    }
  };

  const ungroupedGroup = { id: null, group_name: "Ungrouped Yards" };

  const confirmModals = [
    {
      open: confirmOpen,
      onClose: () => setConfirmOpen(false),
      onConfirm: handleConfirmDelete,
      message: "Are you sure you want to delete this yard?",
    },
    {
      open: confirmGroupOpen,
      onClose: () => setConfirmGroupOpen(false),
      onConfirm: handleConfirmDeleteGroup,
      message: "Are you sure you want to delete this group? All yards will be unassigned.",
    },
    {
      open: !!groupToDelete,
      onClose: () => setGroupToDelete(null),
      onConfirm: async () => {
        if (groupToDelete) {
          await removeYardGroup(groupToDelete.id);
          await fetchGroups();
          setGroupToDelete(null);
        }
      },
      title: "Delete Empty Group?",
      message: `The yard group "${groupToDelete?.name}" is now empty. Do you want to delete it?`,
    },
  ];

  return (
    <div className="px-4 sm:px-8 md:px-16 lg:px-24 flex flex-col justify-start min-h-screen w-full">
      <h1 className="text-2xl font-bold mb-2 text-center">Yard Groups</h1>

      {loading ? <p>Loading yards...</p> : error ? <p className="text-red-500">{error}</p> : null}

      <div className="rounded-lg pt-4 w-full flex flex-col items-center justify-center space-y-4">
        {[...groups, ungroupedGroup].map((group) => {
          const groupYards =
            group.id === null ? yards.filter((y) => !y.yard_group) : yards.filter((y) => y.yard_group === group.id);
          if (!groupYards.length && group.id !== null) return null;

          return (
            <GroupAccordion
              key={group.id ?? "ungrouped"}
              group={group}
              yards={groupYards}
              groups={groups}
              prefsByYard={prefsByYard}
              editingGroupId={editingGroupId}
              editingGroupName={editingGroupName}
              setEditingGroupId={setEditingGroupId}
              setEditingGroupName={setEditingGroupName}
              onEditGroup={handleSaveGroupName}
              onDeleteGroup={handleDeleteGroupClick}
              onEditYard={setEditYard}
              onDeleteYard={handleDeleteClick}
              isEditable={group.id !== null}
            />
          );
        })}

        <Button
          variant="contained"
          sx={{ backgroundColor: "#a14525", "&:hover": { backgroundColor: "#c65b3b" }, maxWidth: "45%", mt: 2 }}
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
        setPreferencesOpen={setPreferencesOpen}
        setSelectedYardId={setSelectedYardId}
      />

      <PreferencesModal
        open={preferencesOpen}
        onClose={() => setPreferencesOpen(false)}
        yardId={selectedYardId}
        onPreferencesSaved={handleYardCreated}
        initialPrefs={prefsByYard[selectedYardId]}
      />

      {confirmModals.map((c, i) => (
        <ConfirmModal key={i} {...c} />
      ))}
    </div>
  );
}
