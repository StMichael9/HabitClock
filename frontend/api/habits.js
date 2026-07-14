import axios from "axios";
axios.defaults.baseURL = "http://localhost:5000";
axios.defaults.withCredentials = true;

// Returns all habits
export function getHabits() {
  return axios.get("/habits/");
}

// Returns one
export function getHabit(id) {
  return axios.get(`/habits/${id}`);
}

export function createHabit(data) {
  return axios.post("/habits/", {
    name: data.name,
    description: data.description,
  });
}

export function updateHabit(id, data) {
  return axios.patch(`/habits/${id}`, data);
}

export function deleteHabit(id) {
  return axios.delete(`/habits/${id}`);
}
