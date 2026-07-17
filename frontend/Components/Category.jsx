import { useEffect, useState } from "react";
import {
  getCategories,
  createCategory,
  deleteCategory,
} from "../api/categories";

export default function Categories({ categories, setCategories }) {
  const [newCategory, setNewCategory] = useState("");
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  const loadCategories = async () => {
    try {
      const res = await getCategories();
      setCategories(res.data);
    } catch {
      setError("Failed to load categories");
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleCreate = async () => {
    if (!newCategory.trim()) return;

    try {
      const res = await createCategory({ name: newCategory });
      setCategories([...categories, res.data]);
      setNewCategory("");
    } catch {
      setError("Failed to create category");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCategory(id);
      setCategories(categories.filter((c) => c.id !== id));
    } catch {
      setError("Failed to delete category");
    }
  };

  return (
    <div className="categories-container">
      <button className="categories-toggle" onClick={() => setOpen(!open)}>
        {open ? "Hide Categories" : "Manage Categories"}
      </button>

      {open && (
        <div className="categories-panel">
          <h3>Categories</h3>

          {error && <p className="error-text">{error}</p>}

          <div className="category-create-row">
            <input
              type="text"
              placeholder="New category name"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="category-input"
            />
            <button onClick={handleCreate} className="category-add-btn">
              Add
            </button>
          </div>

          <div className="category-list">
            {categories.length === 0 ? (
              <p className="category-empty">No categories yet.</p>
            ) : (
              categories.map((c) => (
                <div key={c.id} className="category-item">
                  <span>{c.name}</span>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="category-delete-btn"
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
