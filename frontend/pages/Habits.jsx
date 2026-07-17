import { useEffect, useState } from "react";
import {
  getHabits,
  createHabit,
  updateHabit,
  deleteHabit,
} from "../api/habits";

import Categories from "../Components/Category";
export default function Habits() {
  const [habits, setHabits] = useState([]);
  const [categories, setCategories] = useState([]);

  // Habit creation
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");

  // Editing habit
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editCategoryId, setEditCategoryId] = useState("");

  const [error, setError] = useState("");

  useEffect(() => {
    loadHabits();
  }, []);

  const loadHabits = async () => {
    try {
      const res = await getHabits();
      setHabits(res.data);
    } catch {
      setError("Failed to load habits");
    }
  };

  // Create habit
  const handleCreate = async () => {
    try {
      await createHabit({
        name,
        description,
        category_id: categoryId ? Number(categoryId) : null,
      });

      await loadHabits();

      setName("");
      setDescription("");
      setCategoryId("");
    } catch {
      setError("Failed to create habit");
    }
  };

  // Begin editing
  const startEditing = (habit) => {
    setEditingId(habit.id);
    setEditName(habit.name);
    setEditDescription(habit.description);
    setEditCategoryId(habit.category_id || "");
  };

  // Save edit
  const handleUpdate = async () => {
    try {
      await updateHabit(editingId, {
        name: editName,
        description: editDescription,
        category_id: editCategoryId ? Number(editCategoryId) : null,
      });

      setEditingId(null);
      loadHabits();
    } catch {
      setError("Failed to update habit");
    }
  };

  // Delete habit
  const handleDelete = async (id) => {
    try {
      await deleteHabit(id);
      loadHabits();
    } catch {
      setError("Failed to delete habit");
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>Your Habits</h1>

      {/* Categories Component */}
      <Categories categories={categories} setCategories={setCategories} />

      {/* Create Habit */}
      <div style={{ marginBottom: "20px" }}>
        <h2>Create Habit</h2>

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ marginRight: "10px" }}
        />

        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ marginRight: "10px" }}
        />

        {/* Category Dropdown */}
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          style={{ marginRight: "10px" }}
        >
          <option value="">No Category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <button onClick={handleCreate}>Create</button>
      </div>

      {/* Error */}
      {error && (
        <div style={{ color: "crimson", marginBottom: "20px" }}>{error}</div>
      )}

      {/* Habit List */}
      <div>
        <h2>Habit List</h2>
        {habits.map((habit) => (
          <div
            key={habit.id}
            style={{
              padding: "10px",
              border: "1px solid #ccc",
              marginBottom: "10px",
              borderRadius: "6px",
            }}
          >
            <strong>{habit.name}</strong>
            <p>{habit.description}</p>

            <p style={{ fontStyle: "italic", color: "#555" }}>
              Category: {habit.category?.name || "None"}
            </p>

            <button onClick={() => startEditing(habit)}>Edit</button>
            <button
              style={{ marginLeft: "10px", color: "red" }}
              onClick={() => handleDelete(habit.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* Edit Habit */}
      {editingId && (
        <div style={{ marginTop: "20px" }}>
          <h2>Edit Habit</h2>

          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            style={{ marginRight: "10px" }}
          />

          <input
            type="text"
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            style={{ marginRight: "10px" }}
          />

          <select
            value={editCategoryId}
            onChange={(e) => setEditCategoryId(e.target.value)}
            style={{ marginRight: "10px" }}
          >
            <option value="">No Category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <button onClick={handleUpdate}>Save</button>
          <button
            style={{ marginLeft: "10px" }}
            onClick={() => setEditingId(null)}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
