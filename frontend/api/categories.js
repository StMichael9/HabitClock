import axios from "axios";

axios.defaults.baseURL = "http://localhost:5000";
axios.defaults.withCredentials = true;

// Get all categories
export function getCategories() {
  return axios.get(`/categories/`);
}

// Create a new category
export function createCategory(data) {
  return axios.post(`/categories/`, data, {
    headers: { "Content-Type": "application/json" },
  });
}

// Update a category
export function updateCategory(categoryId, data) {
  return axios.patch(`/categories/${categoryId}`, data, {
    headers: { "Content-Type": "application/json" },
  });
}

// Delete a category
export function deleteCategory(categoryId) {
  return axios.delete(`/categories/${categoryId}`);
}
