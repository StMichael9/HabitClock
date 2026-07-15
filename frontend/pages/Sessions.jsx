import { useEffect, useState, useRef } from "react";
import { getHabits } from "../api/habits";
import {
  getSessions,
  startSession,
  stopSession,
  deleteSession,
} from "../api/sessions";

const styles = {
  container: { padding: "20px", fontFamily: "sans-serif" },
  formGroup: { marginBottom: "20px" },
  error: {
    background: "#ffe5e5",
    padding: "10px",
    borderRadius: "6px",
    color: "#b30000",
    marginBottom: "20px",
  },
  card: {
    padding: "10px",
    border: "1px solid #ccc",
    marginBottom: "10px",
    borderRadius: "6px",
  },
};

export default function Sessions() {
  const [habits, setHabits] = useState([]);
  const [selectedHabitId, setSelectedHabitId] = useState("");
  const [sessions, setSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const [error, setError] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const abortRef = useRef(null);

  useEffect(() => {
    request(
      getHabits,
      (res) => setHabits(res.data || []),
      "Failed to load habits.",
    );
    return () => abortRef.current?.abort();
  }, []);

  const request = async (apiCall, onSuccess, errMsg) => {
    setIsLoading(true);
    setError("");
    try {
      const res = await apiCall();
      onSuccess(res);
    } catch (err) {
      if (err.name !== "AbortError") setError(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const loadSessions = (habitId) => {
    if (!habitId) return;
    abortRef.current?.abort();
    abortRef.current = new AbortController();
    request(
      () => getSessions(habitId),
      (res) => {
        const all = res.data || [];
        setSessions(all);
        const active = all.find((s) => !s.end_time) || null;
        setCurrentSession(active);

        if (active) {
          const parsedStart = new Date(
            typeof active.start_time === "string"
              ? active.start_time.replace(" ", "T")
              : active.start_time,
          );
          const initialDiff = Math.floor((new Date() - parsedStart) / 1000);
          setElapsed(initialDiff > 0 ? initialDiff : 0);
        }
      },
      "Failed to load sessions.",
    );
  };

  const handleHabitSelect = (e) => {
    const id = e.target.value;
    setSelectedHabitId(id);
    id
      ? loadSessions(id)
      : (() => {
          setSessions([]);
          setCurrentSession(null);
        })();
  };

  const handleAction = async (action, errMsg) => {
    if (isLoading || !selectedHabitId) return;
    await request(
      () => action(selectedHabitId),
      () => {
        setElapsed(0);
        loadSessions(selectedHabitId);
      },
      errMsg,
    );
  };

  useEffect(() => {
    if (!currentSession || currentSession.end_time) {
      setElapsed(0);
      return;
    }
    const interval = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [currentSession]);

  return (
    <div style={styles.container}>
      <h1>Sessions</h1>
      <div style={styles.formGroup}>
        <h2>Select Habit</h2>
        <select
          value={selectedHabitId}
          onChange={handleHabitSelect}
          disabled={isLoading}
          style={{ padding: "5px" }}
        >
          <option value="">-- Choose a Habit --</option>
          {habits.map((h) => (
            <option key={h.id} value={h.id}>
              {h.name}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div style={styles.error}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {selectedHabitId && (
        <div style={styles.formGroup}>
          <h2>Session Controls</h2>
          {currentSession ? (
            <div>
              <p>
                <strong>Running Since:</strong>{" "}
                {new Date(currentSession.start_time).toLocaleString()}
              </p>
              <h3>
                Time: {Math.floor(elapsed / 60)}m {elapsed % 60}s
              </h3>
              <button
                onClick={() =>
                  handleAction(stopSession, "Failed to stop session.")
                }
                disabled={isLoading}
              >
                Stop Session
              </button>
            </div>
          ) : (
            <button
              onClick={() =>
                handleAction(startSession, "Failed to start session.")
              }
              disabled={isLoading}
            >
              Start Session
            </button>
          )}
        </div>
      )}

      {selectedHabitId && (
        <div>
          <h2>Session History</h2>
          {sessions.length === 0 ? (
            <p>No sessions yet.</p>
          ) : (
            sessions.map((s) => (
              <div key={s.id} style={styles.card}>
                <p>
                  <strong>Start:</strong>{" "}
                  {new Date(s.start_time).toLocaleString()}
                </p>
                <p>
                  <strong>End:</strong>{" "}
                  {s.end_time
                    ? new Date(s.end_time).toLocaleString()
                    : "Still running"}
                </p>
                <button
                  style={{ color: "red", cursor: "pointer" }}
                  disabled={isLoading}
                  onClick={() => {
                    if (window.confirm("Delete this session?")) {
                      request(
                        () => deleteSession(s.id),
                        () => loadSessions(selectedHabitId),
                        "Failed to delete session.",
                      );
                    }
                  }}
                >
                  Delete Session
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
