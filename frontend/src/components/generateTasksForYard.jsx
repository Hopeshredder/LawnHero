import { createTask, getPrefs, getTaskForYard, deleteTask } from "../Api";

// Helper to get next Saturday from a given date
function getNextSaturday(fromDate = new Date()) {
  const date = new Date(fromDate);
  const day = date.getDay();
  const diff = (6 - day + 7) % 7; // days until Saturday
  date.setDate(date.getDate() + (diff === 0 ? 7 : diff)); // if today is Sat, pick next Sat
  return date;
}

// Helper to format date as YYYY-MM-DD
function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export async function generateTasksForYard(yard, options = {}) {
  const { stopDates = {}, seasonalTasks = {}, prefs: passedPrefs } = options;

  // Use passed prefs first; only fetch if not provided
  let prefs = passedPrefs;
  if (!prefs) {
    try {
      prefs = await getPrefs(yard.id);
    } catch (err) {
      console.warn("Failed to fetch preferences, skipping task generation", err);
      return;
    }
  }

  if (!prefs) {
    console.warn("No preferences found for yard", yard.id);
    return;
  }

  // --- DELETE OLD AUTO-GENERATED WATER & MOW TASKS ---
  try {
    const existingTasks = await getTaskForYard(yard.id);
    const tasksToDelete = existingTasks.filter(
      (t) =>
        t.auto_generated &&
        (t.activity_type === "Water" || t.activity_type === "Mow")
    );
    for (let t of tasksToDelete) {
      await deleteTask(t.id);
    }
  } catch (err) {
    console.error("Failed to delete old auto-generated Water/Mow tasks", err);
  }

  const today = new Date();
  const waterInterval = prefs.watering_interval ?? 2;
  const mowInterval = prefs.mowing_interval ?? 7;
  const waterStop = stopDates.watering || new Date(today.getFullYear(), 10, 1);
  const mowStop = stopDates.mowing || new Date(today.getFullYear(), 10, 1);
  const year = today.getFullYear();

  // --- WATER ---
  let waterDate = new Date(today);
  while (waterDate < waterStop) {
    try {
      await createTask(yard.id, {
        activity_type: "Water",
        day_scheduled: formatDate(waterDate),
        auto_generated: true,
      });
    } catch (err) {
      console.error("Failed to create Water task", err);
    }
    waterDate.setDate(waterDate.getDate() + waterInterval);
  }

  // --- MOW ---
  let mowDate = getNextSaturday(today);
  while (mowDate < mowStop) {
    try {
      await createTask(yard.id, {
        activity_type: "Mow",
        day_scheduled: formatDate(mowDate),
        auto_generated: true,
      });
    } catch (err) {
      console.error("Failed to create Mow task", err);
    }
    mowDate.setDate(mowDate.getDate() + mowInterval);
  }

  // --- FERTILIZE ---
  const fertilizeDates = seasonalTasks.fertilize || [
    new Date(year, 2, 1),
    new Date(year, 5, 1),
    new Date(year, 8, 17),
  ];

  for (let date of fertilizeDates) {
    const taskDate = getNextSaturday(date);
    try {
      await createTask(yard.id, {
        activity_type: "Fertilize",
        day_scheduled: formatDate(taskDate),
        auto_generated: true,
      });
    } catch (err) {
      console.error("Failed to create Fertilize task", err);
    }
  }
  // --- AERATE ---
  const aerateDates = seasonalTasks.aerate || [
    new Date(year, 3, 1),
    new Date(year, 8, 1),
  ];
  for (let date of aerateDates) {
    const taskDate = getNextSaturday(date);
    try {
      await createTask(yard.id, {
        activity_type: "Aerate",
        day_scheduled: formatDate(taskDate),
        auto_generated: true,
      });
    } catch (err) {
      console.error("Failed to create Aerate task", err);
    }
  }

  // --- DETHATCH ---
  const dethatchDates = seasonalTasks.dethatch || [
    new Date(year, 3, 10),
    new Date(year, 8, 9),
  ];
  for (let date of dethatchDates) {
    const taskDate = getNextSaturday(date);
    try {
      await createTask(yard.id, {
        activity_type: "Dethatch",
        day_scheduled: formatDate(taskDate),
        auto_generated: true,
      });
    } catch (err) {
      console.error("Failed to create Dethatch task", err);
    }
  }
}
