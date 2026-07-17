import axios from "axios";
axios.defaults.baseURL = "https://habitclock-1.onrender.com/";
axios.defaults.withCredentials = true;

// Returns all habits
export function getHabits() {
  return axios.get("/habits");
}

// Returns one
export function getHabit(id) {
  return axios.get(`/habits${id}`);
}

export function createHabit(data) {
  return axios.post("/habits", data);
}

export function updateHabit(id, data) {
  return axios.patch(`/habits${id}`, data);
}

export function deleteHabit(id) {
  return axios.delete(`/habits${id}`);
}
