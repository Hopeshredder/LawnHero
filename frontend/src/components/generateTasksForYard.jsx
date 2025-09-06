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

// --- Helper to safely create a task ---
async function safeCreateTask(yardId, activity, date) {
  try {
    await createTask(yardId, {
      activity_type: activity,
      day_scheduled: formatDate(date),
      auto_generated: true,
    });
  } catch (err) {
    console.error(`Failed to create ${activity} task`, err);
  }
}

// --- Helper to delete old auto-generated tasks for given types ---
async function deleteOldAutoTasks(yardId, types = []) {
  try {
    const tasks = await getTaskForYard(yardId);
    for (const t of tasks.filter(
      (t) =>
        t.auto_generated &&
        types.includes(t.activity_type) &&
        t.day_completed == null
    )) {
      await deleteTask(t.id);
    }
  } catch (err) {
    console.error("Failed to delete old auto-generated tasks", err);
  }
}

// --- Helper to generate tasks at intervals ---
async function generateIntervalTasks(
  yardId,
  activity,
  startDate,
  stopDate,
  interval
) {
  let date = new Date(startDate);
  while (date < stopDate) {
    await safeCreateTask(yardId, activity, date);
    date.setDate(date.getDate() + interval);
  }
}

// --- Helper to safely create a task only if it doesn't exist ---
async function safeCreateTaskUnique(yardId, activity, date, existingTasks) {
  const formattedDate = formatDate(date);
  const duplicate = existingTasks.some(
    (t) =>
      t.auto_generated &&
      t.activity_type === activity &&
      t.day_scheduled === formattedDate
  );

  if (duplicate) {
    console.log(`Skipping duplicate ${activity} task on ${formattedDate}`);
    return;
  }

  try {
    const task = await createTask(yardId, {
      activity_type: activity,
      day_scheduled: formattedDate,
      auto_generated: true,
    });
    existingTasks.push(task); // keep list updated
  } catch (err) {
    console.error(`Failed to create ${activity} task`, err);
  }
}

// --- Main generator function ---
export async function generateTasksForYard(yard, options = {}) {
  const { stopDates = {}, seasonalTasks = {}, prefs: passedPrefs } = options;

  // Use passed prefs first; fetch only if not provided
  let prefs = passedPrefs;
  if (!prefs) {
    try {
      prefs = await getPrefs(yard.id);
    } catch (err) {
      console.warn(
        "Failed to fetch preferences, skipping task generation",
        err
      );
      return;
    }
  }
  if (!prefs) {
    console.warn("No preferences found for yard", yard.id);
    return;
  }

  const existingTasks = await getTaskForYard(yard.id);

  // --- DELETE OLD WATER & MOW TASKS ---
  await deleteOldAutoTasks(yard.id, ["Water", "Mow"]);

  const today = new Date();
  const year = today.getFullYear();

  // Interval-based tasks
  const waterInterval = prefs.watering_interval ?? 2;
  const mowInterval = prefs.mowing_interval ?? 7;
  const waterStop = stopDates.watering || new Date(year, 10, 1);
  const mowStop = stopDates.mowing || new Date(year, 10, 1);

  await generateIntervalTasks(
    yard.id,
    "Water",
    today,
    waterStop,
    waterInterval
  );
  await generateIntervalTasks(
    yard.id,
    "Mow",
    getNextSaturday(today),
    mowStop,
    mowInterval
  );

  // Seasonal tasks with defaults
  const seasonalMapping = {
    Fertilize: seasonalTasks.fertilize || [
      new Date(year, 2, 1),
      new Date(year, 5, 1),
      new Date(year, 8, 17),
    ],
    Aerate: seasonalTasks.aerate || [
      new Date(year, 3, 1),
      new Date(year, 8, 1),
    ],
    Dethatch: seasonalTasks.dethatch || [
      new Date(year, 3, 10),
      new Date(year, 8, 9),
    ],
  };

  for (const [activity, dates] of Object.entries(seasonalMapping)) {
    for (let date of dates) {
      await safeCreateTaskUnique(
        yard.id,
        activity,
        getNextSaturday(date),
        existingTasks
      );
    }
  }
}
