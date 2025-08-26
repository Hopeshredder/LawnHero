import axios from 'axios';

// Defines the base URL used to access all backend Django calls
export const api = axios.create({
    baseURL: "http://127.0.0.1:8000/api/v1/",
    withCredentials: true, // This tells frontend to send Auth cookie with request
});

// Registers a User
export const registerUser = async (email, password) => {
    try {
        const res = await api.post("users/signup/", { email, password });
        return res.data; // { email }
    } catch (err) {
        console.error("registerUser failed:", err.response?.data || err.message);
        throw err;
    }
};

// Attempts to log a user in with the given email and password
export const loginUser = async (email, password) => {
    try {
        const res = await api.post("users/login/", { email, password });
        return res.data; // { email }
    } catch (err) {
        console.error("loginUser failed:", err.response?.data || err.message);
        throw err;
    }
};

// Gets a user's info (email and whether or not they are super)
export const getUserInfo = async () => {
    try {
        const res = await api.get("users/info/");
        return res.data; // { email, is_super }
    } catch (err) {
        console.error("getUserInfo failed:", err.response?.data || err.message);
        throw err;
    }
};

// Returns whether or not a user is authorized
export const authMe = async () => {
    try {
        const res = await api.get("users/auth/me/");
        return res.data; // { email, is_super } or anon { email:null, is_super:false }
    } catch (err) {
        console.error("authMe failed:", err.response?.data || err.message);
        // return a safe fallback if you prefer:
        return { email: null, is_super: false };
    }
};

// Logs a user out
export const logoutUser = async () => {
    try {
        await api.post("users/logout/");
        return null;
    } catch (err) {
        console.error("logoutUser failed:", err.response?.data || err.message);
        throw err;
    }
};

// Creates a yard object with the given information
export const createYard = async (payload) => {
    const res = await api.post('ENDPOINT/', payload);
    return res.data;
};

// Gets a yard object
export const getYard = async (id) => {
    const res = await api.get(`ENDPOINT/${id}/`);
    return res.data;
};

// Updates yard object
export const updateYard = async (id, payload) => {
    const res = await api.put(`ENDPOINT/${id}/`, payload);
    return res.data;
}

// Removes a yard object
export const removeYard = async (id) => {
    const res = await api.delete(`ENDPOINT/${id}/`);
    return res.data;
}