import { useEffect, useState } from "react";
import { getHabits } from "../api/habits";
import { getSessions } from "../api/sessions";
import { getGoals, createGoal, updateGoal, deleteGoal } from "../api/goals";

const parseDate = (value) => {
  if (!value) return null;
  if (value instanceof Date) return value;

  const normalized =
    typeof value === "string" && !/(Z|[+-]\d{2}:?\d{2})$/.test(value)
      ? `${value.replace(" ", "T")}Z`
      : value;

  return new Date(normalized);
};

const formatDate = (value) => {
  const date = parseDate(value);
  if (!date) return "No deadline";
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const daysUntil = (value) => {
  const date = parseDate(value);
  if (!date) return null;
  const diffMs = date.setHours(23, 59, 59, 999) - Date.now();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
};

export default function Goals() {
  const [habits, setHabits] = useState([]);
  const [goals, setGoals] = useState([]);
  const [hoursByHabit, setHoursByHabit] = useState({});
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Create form
  const [habitId, setHabitId] = useState("");
  const [targetHours, setTargetHours] = useState("");
  const [deadline, setDeadline] = useState("");

  // Editing
  const [editingId, setEditingId] = useState(null);
  const [editTargetHours, setEditTargetHours] = useState("");
  const [editDeadline, setEditDeadline] = useState("");

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    setIsLoading(true);
    setError("");
    try {
      const [habitsRes, goalsRes] = await Promise.all([
        getHabits(),
        getGoals(),
      ]);
      setHabits(habitsRes.data || []);
      setGoals(goalsRes.data || []);
      await loadProgress(goalsRes.data || []);
    } catch {
      setError("Failed to load goals.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadProgress = async (goalList) => {
    const uniqueHabitIds = [...new Set(goalList.map((g) => g.habit_id))];
    const results = {};

    await Promise.all(
      uniqueHabitIds.map(async (id) => {
        try {
          const res = await getSessions(id);
          const totalSeconds = (res.data || []).reduce(
            (sum, s) => sum + (s.duration || 0),
            0,
          );
          results[id] = totalSeconds / 3600;
        } catch {
          results[id] = null;
        }
      }),
    );

    setHoursByHabit(results);
  };

  const habitName = (id) =>
    habits.find((h) => h.id === id)?.name || "Unknown habit";

  const handleCreate = async () => {
    if (!habitId || !targetHours) return;
    setError("");
    try {
      await createGoal({
        habit_id: Number(habitId),
        target_hours: Number(targetHours),
        deadline: deadline ? `${deadline}T00:00:00` : null,
      });
      setHabitId("");
      setTargetHours("");
      setDeadline("");
      await loadAll();
    } catch {
      setError("Failed to create goal.");
    }
  };

  const startEditing = (goal) => {
    setEditingId(goal.id);
    setEditTargetHours(goal.target_hours);
    setEditDeadline(
      goal.deadline ? parseDate(goal.deadline)?.toISOString().slice(0, 10) : "",
    );
  };

  const handleUpdate = async () => {
    setError("");
    try {
      await updateGoal(editingId, {
        target_hours: Number(editTargetHours),
        deadline: editDeadline ? `${editDeadline}T00:00:00` : null,
      });
      setEditingId(null);
      await loadAll();
    } catch {
      setError("Failed to update goal.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this goal?")) return;
    setError("");
    try {
      await deleteGoal(id);
      await loadAll();
    } catch {
      setError("Failed to delete goal.");
    }
  };

  return (
    <div className="goals-page">
      <h1>Goals</h1>
      <p className="goals-subtitle">
        Track long-term targets and keep your habits pointed at them.
      </p>

      {error && (
        <div className="error-banner">
          <strong>Error:</strong> {error}
        </div>
      )}

      <div className="goal-create-card">
        <h2>New Goal</h2>

        <div className="goal-form-row">
          <select
            value={habitId}
            onChange={(e) => setHabitId(e.target.value)}
            className="select-input"
          >
            <option value="">-- Choose a Habit --</option>
            {habits.map((h) => (
              <option key={h.id} value={h.id}>
                {h.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            min="1"
            placeholder="Target hours"
            value={targetHours}
            onChange={(e) => setTargetHours(e.target.value)}
            className="text-input goal-hours-input"
          />

          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="text-input"
          />

          <button
            onClick={handleCreate}
            disabled={!habitId || !targetHours || isLoading}
            className="btn btn-start"
          >
            Add Goal
          </button>
        </div>
      </div>

      <div className="goal-list">
        {isLoading && goals.length === 0 ? (
          <p className="empty-state">Loading goals…</p>
        ) : goals.length === 0 ? (
          <p className="empty-state">No goals yet. Set one above.</p>
        ) : (
          goals.map((goal) => {
            const isEditing = editingId === goal.id;
            const actualHours = hoursByHabit[goal.habit_id];
            const pct =
              actualHours != null && goal.target_hours
                ? Math.min(
                    100,
                    Math.round((actualHours / goal.target_hours) * 100),
                  )
                : null;
            const remainingDays = daysUntil(goal.deadline);

            return (
              <div key={goal.id} className="goal-card">
                {isEditing ? (
                  <div className="goal-edit-row">
                    <input
                      type="number"
                      min="1"
                      value={editTargetHours}
                      onChange={(e) => setEditTargetHours(e.target.value)}
                      className="text-input goal-hours-input"
                    />
                    <input
                      type="date"
                      value={editDeadline}
                      onChange={(e) => setEditDeadline(e.target.value)}
                      className="text-input"
                    />
                    <button onClick={handleUpdate} className="btn btn-start">
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="btn btn-delete"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="goal-card-header">
                      <span className="goal-habit-name">
                        {habitName(goal.habit_id)}
                      </span>
                      {goal.deadline && (
                        <span
                          className={`badge ${
                            remainingDays != null && remainingDays < 0
                              ? "badge-overdue"
                              : "badge-deadline"
                          }`}
                        >
                          {remainingDays != null && remainingDays < 0
                            ? "Overdue"
                            : `${remainingDays}d left`}
                        </span>
                      )}
                    </div>

                    <div className="goal-progress-row">
                      <span className="goal-hours-label">
                        {actualHours != null
                          ? `${actualHours.toFixed(1)}h / ${goal.target_hours}h`
                          : `Target: ${goal.target_hours}h`}
                      </span>
                      <span className="goal-deadline-label">
                        {formatDate(goal.deadline)}
                      </span>
                    </div>

                    {pct != null && (
                      <div className="progress-track">
                        <div
                          className="progress-fill"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    )}

                    <div className="goal-card-actions">
                      <button
                        onClick={() => startEditing(goal)}
                        className="btn btn-edit"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(goal.id)}
                        className="btn btn-delete"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
