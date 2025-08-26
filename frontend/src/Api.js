import axios from 'axios';

// Defines the base URL used to access all backend Django calls
const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/v1/",
});

// Registers a User
export const registerUser = async (email, password, name) => {
    try {
        const response = await api.post("SIGNUP ENDPOINT/", {
            email,
            password,
            name
        });

        console.log('registerUser response data', response.data);

        if (response.status === 201) {
            const { user, token } = response.data;
            localStorage.setItem("token", token);
            api.defaults.headers.common["Authorization"] = `Token ${token}`;
            return user;
        }

        return null;
    } catch (error) {
        console.error("Signup failed:", error.response?.data || error.message);
        throw error;
    }
}

// Logs a user in
export const loginUser = async (email, password) => {
    const response = await api.post("LOGIN ENDPOINT/", { email, password});
    if (response.status === 200) {
        const { user, token} = response.data;
        localStorage.setItem("token", token);
        api.defaults.headers.common["Authorization"] = `Token ${token}`
        console.log(user)
        return user;
    }

    // error case
    console.log('loginUser Error', response.data);
    return null;
}

// Logs a user out
export const logoutUser = async () => {
    // hit the logout endpoint
    console.log('logoutUser, api headers', api.defaults.headers.common)
    const response = await api.post("LOGOUT ENDPOINT/")
    if (response.status === 204) {
        // delete token from localstorage
        localStorage.removeItem("token")
        // delete token from axios api instance
        delete api.defaults.headers.common["Authorization"];
        return null
    }

    console.log('logoutUser logout failed')
}


// Check if auth token exists clientside already
export const userConfirmation = async() => {
    console.log('userConfirmation()')
    const token = localStorage.getItem("token");
    if (token) {
        console.log('got token ', token)
        api.defaults.headers.common["Authorization"] = `Token ${token}`
        // get basic user info and the default user data we want to display
        const response = await api.get("USER INFO ENDPOINT/")
        console.log(response)
        if (response.status === 200) {
            console.log('made api call', response.data.user)
            return response.data.user;
        }
        console.log('userConfirmation returned response other than 200', response.data);
    }
    console.log('userConfirmation error');
    return null;
}

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
export const removeYard = async (id, payload) => {
    const res = await api.delete(`ENDPOINT/${id}/`);
    return res.data;
}