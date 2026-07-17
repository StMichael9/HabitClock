import axios from "axios";

axios.defaults.baseURL = "http://localhost:5000";
axios.defaults.withCredentials = true;

export function getGoals() {
  return axios.get("/goals/");
}

export function getGoal(id) {
  return axios.get(`/goals/${id}`);
}

export function createGoal(data) {
  return axios.post("/goals/", data);
}

export function updateGoal(id, data) {
  return axios.patch(`/goals/${id}`, data);
}

export function deleteGoal(id) {
  return axios.delete(`/goals/${id}`);
}
