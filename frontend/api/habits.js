import { api } from "./client";

// Returns all habits
export function getHabits() {
  return api.get("/habits/");
}

// Returns one
export function getHabit(id) {
  return api.get(`/habits/${id}`);
}

export function createHabit(data) {
  return api.post("/habits/", data);
}

export function updateHabit(id, data) {
  return api.patch(`/habits/${id}`, data);
}

export function deleteHabit(id) {
  return api.delete(`/habits/${id}`);
}
