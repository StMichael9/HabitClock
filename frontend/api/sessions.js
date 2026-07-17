import axios from "axios";

axios.defaults.baseURL = "https://habitclock-1.onrender.com/";
axios.defaults.withCredentials = true;

export function getSessions(habitId) {
  return axios.get(`/sessions${habitId}`);
}

export function startSession(habitId) {
  return axios.post(`/sessions${habitId}/start`);
}

export function stopSession(habitId) {
  return axios.post(`/sessions${habitId}/stop`);
}

export function deleteSession(sessionId) {
  return axios.delete(`/sessions${sessionId}`);
}
