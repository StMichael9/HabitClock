import axios from "axios";

axios.defaults.baseURL = "http://localhost:5000";
axios.defaults.withCredentials = true;

export function getSessions(habitId) {
  return axios.get(`/sessions/${habitId}`);
}

export function startSession(habitId) {
  return axios.post(`/sessions/${habitId}/start`);
}

export function stopSession(habitId) {
  return axios.post(`/sessions/${habitId}/stop`);
}

export function deleteSession(sessionId) {
  return axios.delete(`/sessions/${sessionId}`);
}
