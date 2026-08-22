import axios from "axios";

// Create an Axios instance for server-side (and optionally client-side) fetching
export const api = axios.create({
    // baseURL: process.env.NEXT_PUBLIC_API_URL || "https://api.example.com",
    baseURL: "", // Set to empty string for now, replace with actual API URL later
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

// Optional: Add interceptors here if needed (e.g., for logging or auth tokens)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error("API Error:", error?.response?.data || error.message);
        return Promise.reject(error);
    }
);
