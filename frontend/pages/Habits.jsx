import { useEffect, useState } from "react";
import {
  getHabits,
  createHabit,
  updateHabit,
  deleteHabit,
} from "../api/habits";

export default function Habits() {
  const [habits, setHabits] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const [error, setError] = useState("");

  // Load habits on mount
  useEffect(() => {
    loadHabits();
  }, []);

  const loadHabits = async () => {
    try {
      const res = await getHabits();
      setHabits(res.data);
    } catch (err) {
      setError("Failed to load habits");
    }
  };

  const handleCreate = async () => {
    try {
      await createHabit({ name, description });
      setName("");
      setDescription("");
      loadHabits();
    } catch (err) {
      setError("Failed to create habit");
    }
  };

  const startEditing = (habit) => {
    setEditingId(habit.id);
    setEditName(habit.name);
    setEditDescription(habit.description);
  };

  const handleUpdate = async () => {
    try {
      await updateHabit(editingId, {
        name: editName,
        description: editDescription,
      });
      setEditingId(null);
      loadHabits();
    } catch (err) {
      setError("Failed to update habit");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteHabit(id);
      loadHabits();
    } catch (err) {
      setError("Failed to delete habit");
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>Your Habits</h1>

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
        />
        <button style={{ marginLeft: "10px" }} onClick={handleCreate}>
          Create
        </button>
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
          />
          <button style={{ marginLeft: "10px" }} onClick={handleUpdate}>
            Save
          </button>
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
