import axios from "axios";

axios.defaults.baseURL = "https://habitclock-1.onrender.com/";
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
