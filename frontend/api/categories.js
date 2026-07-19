import { api } from "./client";

export function getCategories() {
  return api.get(`/categories/`);
}

export function createCategory(data) {
  return api.post(`/categories/`, data);
}

export function updateCategory(categoryId, data) {
  return api.patch(`/categories/${categoryId}`, data);
}

export function deleteCategory(categoryId) {
  return api.delete(`/categories/${categoryId}`);
}
