import { api } from "./client";

export function getGoals() {
  return api.get("/goals/");
}

export function getGoal(id) {
  return api.get(`/goals/${id}`);
}

export function createGoal(data) {
  return api.post("/goals/", data);
}

export function updateGoal(id, data) {
  return api.patch(`/goals/${id}`, data);
}

export function deleteGoal(id) {
  return api.delete(`/goals/${id}`);
}
