import axios from "axios";

axios.defaults.baseURL = "https://habitclock-1.onrender.com/";
axios.defaults.withCredentials = true;

export function getCategories() {
  return axios.get(`/categories/`);
}

export function createCategory(data) {
  return axios.post(`/categories/`, data);
}

export function updateCategory(categoryId, data) {
  return axios.patch(`/categories/${categoryId}`, data);
}

export function deleteCategory(categoryId) {
  return axios.delete(`/categories/${categoryId}`);
}
