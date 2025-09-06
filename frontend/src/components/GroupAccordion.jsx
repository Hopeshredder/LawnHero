import CustomAccordion from "./MUIAccordion";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import YardAccordion from "./YardAccordion";

export default function GroupAccordion({
  group,
  yards,
  groups,
  prefsByYard,
  editingGroupId,
  editingGroupName,
  setEditingGroupId,
  setEditingGroupName,
  onEditGroup,
  onDeleteGroup,
  onEditYard,
  onEditPreferences,
  onDeleteYard,
  isEditable,
  setIsNewYard,
}) {
  const groupYards = yards.filter((yard) => yard.yard_group === group.id);

  // Skip empty groups? Optional
  if (groupYards.length === 0) return null;

  const isEditing = isEditable && editingGroupId === group.id;

  return (
    <CustomAccordion
      className="w-full"
      key={group.id}
      title={
        isEditing ? (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (editingGroupName.trim() !== group.group_name) {
                await onEditGroup(group.id, editingGroupName);
              }
              setEditingGroupId(null);
            }}
            onClick={(e) => e.stopPropagation()}
            style={{ width: "100%" }}
          >
            <input
              type="text"
              value={editingGroupName}
              autoFocus
              onChange={(e) => setEditingGroupName(e.target.value)}
              onBlur={async () => {
                if (editingGroupName.trim() !== group.group_name) {
                  await onEditGroup(group.id, editingGroupName);
                } else {
                  setEditingGroupId(null);
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
        <div className="space-y-4">
          {groupYards.map((yard) => (
            <YardAccordion
              key={yard.id}
              yard={yard}
              groups={groups}
              prefs={prefsByYard[yard.id]}
              onEdit={() => onEditYard(yard)}
              onDelete={() => onDeleteYard(yard.id)}
              setIsNewYard={setIsNewYard}
              onEditYard={() => onEditYard(yard)}
              onEditPreferences={() => onEditPreferences(yard)}
            />
          ))}
        </div>
      }
      actions={
        isEditable ? (
        <div className="flex flex-col items-center gap-2">
          <div className="flex gap-2">
            <EditIcon
              variant="outlined"
              size="small"
              onClick={() => setEditingGroupId(group.id)}
            />
            <DeleteForeverIcon
              variant="outlined"
              color="error"
              size="small"
              onClick={() => onDeleteGroup(group.id)}
            />
          </div>
        </div>
        ) : null
      }
    />
  );
}
