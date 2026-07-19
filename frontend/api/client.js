import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.PROD ? "/api" : "https://habitclock-1.onrender.com",
  withCredentials: true,
});
