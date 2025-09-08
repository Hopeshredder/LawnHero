import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_BASE_URL || "http://127.0.0.1:8000/api/v1/";

// Defines the base URL used to access all backend Django calls
export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // This tells frontend to send Auth cookie with request
});

/* ------------------------   User Object Interaction   ----------------------- */

// Registers a User
export const registerUser = async (email, password) => {
  try {
    const res = await api.post("users/signup/", { email, password });
    return res.data; // { email }
  } catch (err) {
    // console.error("registerUser failed:", err.response?.data || err.message);
    throw err;
  }
};

// Attempts to log a user in with the given email and password
export const loginUser = async (email, password) => {
  try {
    const res = await api.post("users/login/", { email, password });
    return res.data; // { email }
  } catch (err) {
    // console.error("loginUser failed:", err.response?.data || err.message);
    throw err;
  }
};

// Gets a user's info (email and whether or not they are super)
export const getUserInfo = async () => {
  try {
    const res = await api.get("users/info/");
    return res.data; // { email, is_super }
  } catch (err) {
    // console.error("getUserInfo failed:", err.response?.data || err.message);
    throw err;
  }
};

// Returns whether or not a user is authorized
export const authMe = async () => {
  try {
    const res = await api.get("users/auth/me/");
    return res.data; // { email, is_super } or anon { email:null, is_super:false }
  } catch (err) {
    // console.error("authMe failed:", err.response?.data || err.message);
    // return a safe fallback
    return { email: null, is_super: false };
  }
};

// Logs a user out
export const logoutUser = async () => {
  try {
    await api.post("users/logout/");
    return null;
  } catch (err) {
    // console.error("logoutUser failed:", err.response?.data || err.message);
    throw err;
  }
};

// Logs a user out
export const updateUserInfo = async (payload) => {
  try {
    await api.post("users/info/", payload);
    return null; // {"email": user.email, "is_super": user.is_superuser}, 200
  } catch (err) {
    throw err;
  }
};

/* ------------------------   Yard Object Interaction   ----------------------- */

// Creates a yard object with the given information
export const createYard = async (payload) => {
  try {
    const res = await api.post("yards/", payload);
    return res.data;
  } catch (err) {
    // console.error("createYard failed:", err.response?.data || err.message);
    throw err;
  }
};

// Gets a yard object
export const getYard = async (id) => {
  try {
    const res = await api.get(`yards/${id}/`);
    return res.data;
  } catch (err) {
    // console.error("getYard failed:", err.response?.data || err.message);
    throw err;
  }
};

// Gets a list of all yard objects associated with a user
export const getYardList = async () => {
  try {
    const res = await api.get("yards/");
    return res.data;
  } catch (err) {
    // console.error("getYardList failed:", err.response?.data || err.message);
    throw err;
  }
};

// Updates yard object
export const updateYard = async (id, payload) => {
  try {
    const res = await api.put(`yards/${id}/`, payload);
    return res.data;
  } catch (err) {
    // console.error("updateYard failed:", err.response?.data || err.message);
    throw err;
  }
};

// Removes a yard object
export const removeYard = async (id) => {
  try {
    const res = await api.delete(`yards/${id}/`);
    return res.data;
  } catch (err) {
    // console.error("removeYard failed:", err.response?.data || err.message);
    throw err;
  }
};

/* ------------------------   Yard Group Interaction   ------------------------ */

// Creates a yard group (group_name optional)
export const createYardGroup = async (group_name) => {
  try {
    // if a group name is provided, use it. If not, send nothing
    const payload = group_name ? { group_name } : {};
    const res = await api.post("yards/yard-groups/", payload);
    return res.data; // { id, yards: [], group_name, user }
  } catch (err) {
    throw err;
  }
};

// Gets all yard groups
export const getYardGroup = async () => {
  try {
    const res = await api.get("yards/yard-groups/");
    return res.data; // { id, yards: [<yard objects>], group_name, user }
  } catch (err) {
    console.error("getYardGroup failed:", err.response?.data || err.message);
    throw err;
  }
};

// Updates a yard group name
export const updateYardGroup = async (group_id, { group_name }) => {
  try {
    const res = await api.put(`yards/yard-groups/${group_id}/`, { group_name });
    return res.data; // { id, yards: [<yard objects>], group_name, user }
  } catch (err) {
    throw err;
  }
};

// Removes a yard group object
export const removeYardGroup = async (group_id) => {
  try {
    const res = await api.delete(`yards/yard-groups/${group_id}/`);
    return res.data; // returns null
  } catch (err) {
    throw err;
  }
};

// Adds a yard to a given yard group
export const addYardToYardGroup = async (group_id, yard_id) => {
  try {
    const res = await api.post(
      `yards/yard-groups/${group_id}/yard/${yard_id}/`
    );
    return res.data; // { success: "Yard added to group" } or { error: "error msg" }
  } catch (err) {
    throw err;
  }
};

// Removes a yard from a given yard group
export const removeYardFromGroup = async (group_id, yard_id) => {
  try {
    const res = await api.delete(
      `yards/yard-groups/${group_id}/yard/${yard_id}/`
    );
    if (res.status === 204) return null;
    return res.data; // { success: "Yard removed from group" } or { error: "error msg" }
  } catch (err) {
    throw err;
  }
};

/* ---------------------   Yard Preferences Interaction   --------------------- */

// Gets the preferences of a given yard
export const getPrefs = async (yard_id) => {
  try {
    const res = await api.get(`yard_pref/${yard_id}/`);
    return res.data;
  } catch (err) {
    throw err;
  }
};

// Updates the yard's preferences, partial data allowed
export const updatePrefs = async (yard_id, payload) => {
  try {
    const res = await api.post(`yard_pref/${yard_id}/`, payload);
    return res.data;
  } catch (err) {
    throw err;
  }
};

/* -----------------------   Task Object Interaction   ------------------------ */

// Creates a task for a given yard
export const createTask = async (yard_id, payload) => {
  try {
    const res = await api.post(`tasks/${yard_id}/add/`, payload);
    return res.data; // { id, activity_type, day_scheduled, day_completed, yard }
  } catch (err) {
    throw err;
  }
};

// Gets a task by a given task id
export const getTask = async (task_id) => {
  try {
    const res = await api.get(`tasks/task/${task_id}/`);
    return res.data; // { id, activity_type, day_scheduled, day_completed, yard }
  } catch (err) {
    throw err;
  }
};

// Updates a task (selected by ID, can be partial) with the given payload
export const updateTask = async (task_id, payload) => {
  try {
    const res = await api.put(`tasks/task/${task_id}/`, payload);
    return res.data; // { id, activity_type, day_scheduled, day_completed, yard }
  } catch (err) {
    throw err;
  }
};

// Deletes a task by a given task id
export const deleteTask = async (task_id) => {
  try {
    const res = await api.delete(`tasks/task/${task_id}/`);
    if (res.status === 204) return null;
    return res.data;
  } catch (err) {
    throw err;
  }
};

// Gets all tasks for a given yard
export const getTaskForYard = async (yard_id) => {
  try {
    const res = await api.get(`tasks/${yard_id}/`);
    return res.data; // [ task object, ... ]
  } catch (err) {
    throw err;
  }
};

// Gets upcoming and recently completed tasks for a yard
export const fetchRecentTasks = async (yard_id) => {
  try {
    const res = await api.get(`tasks/${yard_id}/due-and-completed/`);
    return res.data; // { upcoming_tasks: [ task object, ... ], recent_tasks: [ task object, ... ] }
  } catch (err) {
    throw err;
  }
};

// Converts zipcode to lat lon
export const fetchLatLonFromZip = async (zipCode) => {
  try {
    const res = await axios.get(`https://api.zippopotam.us/us/${zipCode}`);
    const place = res.data.places?.[0];

    return {
      latitude: parseFloat(place.latitude),
      longitude: parseFloat(place.longitude),
    };
  } catch (err) {
    throw new Error("Could not fetch coordinates for ZIP");
  }
};

/* -----------------------   Tips Object Interaction   ------------------------ */
// Gets the tips for a given yard
export const getTips = async (yard_id) => {
  try {
    const res = await api.get(`tips/${yard_id}/`);
    return res.data; //{ "watering": "supertip", "tools": "...", "yard_problems": "...", "mowing": "...", "fertilizing": "...", "aerating": "...", "detatching": "..." }, 200
  } catch (err) {
    throw err;
  }
};

// Creates the tips for a given yard
export const CreateTips = async (yard_id, payload) => {
  try {
    const res = await api.post(`tips/${yard_id}/`, payload);
    return res.data; // no body, 204
  } catch (err) {
    throw err;
  }
};