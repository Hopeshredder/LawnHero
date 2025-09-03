import { useEffect, useState } from "react";
import { getYardList, getTaskForYard, updateTask, deleteTask } from "../Api";
import CustomAccordion from "../components/MUIAccordion";
import Button from "@mui/material/Button";
import TaskModal from "../components/TaskModal";
import ConfirmModal from "../components/ConfirmModal";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

export default function Todo() {
  const [yards, setYards] = useState([]);
  const [tasksByYard, setTasksByYard] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [activeYard, setActiveYard] = useState(null);
  const [activeTask, setActiveTask] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  useEffect(() => {
    const fetchYards = async () => {
      try {
        const res = await getYardList();
        setYards(res);
      } catch (err) {
        console.error("Failed to fetch yards:", err);
      }
    };
    fetchYards();
  }, []);

  const fetchTasksForYard = async (yardId) => {
    try {
      const res = await getTaskForYard(yardId);
      const sorted = [...res].sort(
        (a, b) => new Date(a.day_scheduled) - new Date(b.day_scheduled)
      );
      setTasksByYard((prev) => ({ ...prev, [yardId]: sorted }));
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
    }
  };

  const handleEditTask = (task) => {
    setActiveTask(task);
    setOpenModal(true);
  };

  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  return (
    <div className="flex flex-col items-center px-4 sm:px-8 md:px-16 lg:px-24">
      <h1 className="text-2xl font-bold mb-2 text-center">To-Do List</h1>
      <div className="flex flex-col gap-4 w-full max-w-2xl mt-4">
        {yards.map((yard) => {
          const tasks = tasksByYard[yard.id] || [];

          const past = tasks.filter((t) => t.day_scheduled < today);
          const todayAndFuture = tasks.filter((t) => t.day_scheduled >= today);

          const content = (
            <div>
              {past.map((t) => {
                const isOverdue = !t.day_completed && t.day_scheduled < today;

                return (
                  <div
                    key={t.id}
                    className={`relative p-2 border rounded mb-1 shadow-sm flex items-center gap-2 ${
                      isOverdue ? "bg-red-300" : "var(--color-medium)"
                    }`}
                  >
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={!!t.day_completed}
                      onChange={async (e) => {
                        const completed = e.target.checked
                          ? new Date().toISOString().split("T")[0]
                          : null;

                        setTasksByYard((prev) => ({
                          ...prev,
                          [yard.id]: prev[yard.id].map((task) =>
                            task.id === t.id
                              ? { ...task, day_completed: completed }
                              : task
                          ),
                        }));

                        try {
                          await updateTask(t.id, { day_completed: completed });
                        } catch (err) {
                          console.error("Failed to update task:", err);
                          setTasksByYard((prev) => ({
                            ...prev,
                            [yard.id]: prev[yard.id].map((task) =>
                              task.id === t.id
                                ? { ...task, day_completed: t.day_completed }
                                : task
                            ),
                          }));
                          alert("Failed to update task completion");
                        }
                      }}
                      className="w-5 h-5"
                      style={{ accentColor: "var(--color-medium)" }}
                    />

                    {/* Activity + Date */}
                    <div className="flex-1 flex items-center justify-between ml-2">
                      <span className="truncate">{t.activity_type}</span>
                      <span className="ml-2 flex-shrink-0">
                        {t.day_scheduled.split("-").slice(1).join("/")}
                      </span>
                    </div>

                    {/* Edit/Delete icons */}
                    <div className="flex gap-2 ml-2 flex-shrink-0">
                      <EditIcon
                        fontSize="small"
                        onClick={() => handleEditTask(t)}
                      />
                      <DeleteForeverIcon
                        fontSize="small"
                        color="error"
                        onClick={() => {
                          setTaskToDelete(t);
                          setConfirmOpen(true);
                        }}
                      />
                    </div>
                  </div>
                );
              })}

              {/* only show in-between button if there are tasks */}
              {tasks.length > 0 && (
                <div className="my-2">
                  <Button
                    onClick={() => {
                      setActiveYard(yard.id);
                      setOpenModal(true);
                    }}
                    className="w-full" // make button full width
                  >
                    <div className="flex w-full justify-between items-center">
                      <span className="text-left">+ New Task</span>
                      <span className="text-center">—</span>
                      <span className="text-right">
                        Today{" "}
                        {new Date().toLocaleDateString("en-US", {
                          month: "numeric",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </Button>
                </div>
              )}

              {todayAndFuture.map((t) => {
                return (
                  <div
                    key={t.id}
                    className="p-2 border rounded mb-1 shadow-sm flex items-center gap-2"
                    style={{ backgroundColor: "var(--color-lightest)" }}
                  >
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={!!t.day_completed}
                      onChange={async (e) => {
                        const completed = e.target.checked
                          ? new Date().toISOString().split("T")[0]
                          : null;

                        setTasksByYard((prev) => ({
                          ...prev,
                          [yard.id]: prev[yard.id].map((task) =>
                            task.id === t.id
                              ? { ...task, day_completed: completed }
                              : task
                          ),
                        }));

                        try {
                          await updateTask(t.id, { day_completed: completed });
                        } catch (err) {
                          console.error("Failed to update task:", err);
                          setTasksByYard((prev) => ({
                            ...prev,
                            [yard.id]: prev[yard.id].map((task) =>
                              task.id === t.id
                                ? { ...task, day_completed: t.day_completed }
                                : task
                            ),
                          }));
                          alert("Failed to update task completion");
                        }
                      }}
                      className="w-5 h-5"
                      style={{ accentColor: "var(--color-medium)" }}
                    />

                    {/* Activity + Date */}
                    <div className="flex-1 flex items-center justify-between ml-2">
                      <span className="truncate">{t.activity_type}</span>
                      <span className="ml-2 flex-shrink-0">
                        {t.day_scheduled.split("-").slice(1).join("/")}
                      </span>
                    </div>

                    {/* Edit/Delete icons */}
                    <div className="flex gap-2 ml-2 flex-shrink-0">
                      <EditIcon
                        fontSize="small"
                        onClick={() => handleEditTask(t)}
                      />
                      <DeleteForeverIcon
                        fontSize="small"
                        color="error"
                        onClick={() => {
                          setTaskToDelete(t);
                          setConfirmOpen(true);
                        }}
                      />
                    </div>
                  </div>
                );
              })}

              {/* empty yard fallback */}
              {tasks.length === 0 && (
                <div className="my-2">
                  <Button
                    onClick={() => {
                      setActiveYard(yard.id);
                      setOpenModal(true);
                    }}
                    className="w-full" // make button full width
                  >
                    <div className="flex w-full justify-between items-center">
                      <span className="text-left">+ New Task</span>
                      <span className="text-center">—</span>
                      <span className="text-right">
                        Today{" "}
                        {new Date().toLocaleDateString("en-US", {
                          month: "numeric",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </Button>
                </div>
              )}
            </div>
          );

          return (
            <CustomAccordion
              key={yard.id}
              title={yard.yard_name}
              content={content}
              onChange={(e, expanded) => {
                if (expanded && !tasksByYard[yard.id]) {
                  fetchTasksForYard(yard.id);
                }
              }}
            />
          );
        })}
      </div>

      {/* Task modal */}
      <TaskModal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          setActiveTask(null);
        }}
        yardId={activeYard}
        task={activeTask}
        onTaskSaved={fetchTasksForYard}
      />
      <ConfirmModal
        open={confirmOpen}
        onClose={() => {
          setConfirmOpen(false);
          setTaskToDelete(null);
        }}
        message={`Are you sure you want to delete "${taskToDelete?.activity_type}"?`}
        onConfirm={async () => {
          if (!taskToDelete) return;

          try {
            await deleteTask(taskToDelete.id);
            fetchTasksForYard(taskToDelete.yard);
          } catch (err) {
            console.error("Failed to delete task:", err);
            alert("Failed to delete task");
          } finally {
            setTaskToDelete(null);
            setConfirmOpen(false);
          }
        }}
      />
    </div>
  );
}
