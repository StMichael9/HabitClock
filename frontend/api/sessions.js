import { api } from "./client";

export function getSessions(habitId) {
  return api.get(`/sessions/${habitId}`);
}

export function startSession(habitId) {
  return api.post(`/sessions/${habitId}/start`);
}

export function stopSession(habitId) {
  return api.post(`/sessions/${habitId}/stop`);
}

export function deleteSession(sessionId) {
  return api.delete(`/sessions/${sessionId}`);
}
