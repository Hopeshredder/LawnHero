import { createTask, getPrefs } from "../Api";

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

export async function generateTasksForYard(yard) {
  let prefs;
  try {
    prefs = await getPrefs(yard.id);
  } catch (err) {
    console.warn("Failed to fetch preferences, skipping task generation", err);
    return;
  }

  if (!prefs) {
    console.warn("No preferences found for yard", yard.id);
    return;
  }

  const waterInterval = prefs.watering_interval ?? 2;
  const mowInterval = prefs.mowing_interval ?? 7;

  const today = new Date();
  const year = today.getFullYear();

  // --- WATER ---
  let waterDate = new Date(today);
  const november = new Date(today.getFullYear(), 10, 1); // November 1st of current year

  while (waterDate < november) {
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

  while (mowDate < november) {
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
  const fertDates = [
    new Date(year, 2, 1), // March
    new Date(year, 5, 1), // June
    new Date(year, 8, 17), // September
  ];

  for (let date of fertDates) {
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
  const aerateDates = [
    new Date(year, 3, 1), // April
    new Date(year, 8, 1), // September
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
  const dethatchDates = [
    new Date(year, 3, 10), // mid-April
    new Date(year, 8, 9), // mid-September
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
