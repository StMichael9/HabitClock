import { useEffect, useState, useRef } from "react";
import { getHabits } from "../api/habits";
import {
  getSessions,
  startSession,
  stopSession,
  deleteSession,
} from "../api/sessions";

const parseSessionTime = (value) => {
  if (!value) return null;
  if (value instanceof Date) return value;

  const normalizedValue =
    typeof value === "string" && !/(Z|[+-]\d{2}:?\d{2})$/.test(value)
      ? `${value.replace(" ", "T")}Z`
      : value;

  return new Date(normalizedValue);
};

const formatDuration = (totalSeconds) => {
  if (totalSeconds == null) return null;
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;

  if (h > 0) return `${h}h ${m}m ${s}s`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
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
          const parsedStart = parseSessionTime(active.start_time);
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
    <div className="sessions-page">
      <h1 className="page-title">Sessions</h1>
      <p className="page-subtitle">
        Start focused blocks and review your history clearly.
      </p>

      <section className="panel">
        <h2>Select Habit</h2>
        <div className="sessions-top-row">
          <select
            value={selectedHabitId}
            onChange={handleHabitSelect}
            disabled={isLoading}
            className="select-input"
          >
            <option value="">-- Choose a Habit --</option>
            {habits.map((h) => (
              <option key={h.id} value={h.id}>
                {h.name}
              </option>
            ))}
          </select>
        </div>
      </section>

      {error && <div className="error-banner">{error}</div>}

      {selectedHabitId && (
        <section className="panel">
          <h2>Session Controls</h2>
          {currentSession ? (
            <div>
              <p>
                <strong>Running Since:</strong>{" "}
                {parseSessionTime(currentSession.start_time)?.toLocaleString()}
              </p>
              <div className="session-running">
                Time: {Math.floor(elapsed / 60)}m {elapsed % 60}s
              </div>
              <button
                onClick={() =>
                  handleAction(stopSession, "Failed to stop session.")
                }
                disabled={isLoading}
                className="btn btn-danger"
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
              className="btn btn-primary"
            >
              Start Session
            </button>
          )}
        </section>
      )}

      {selectedHabitId && (
        <section className="panel session-list">
          <h2>Session History</h2>
          {sessions.length === 0 ? (
            <p className="empty-state">No sessions yet.</p>
          ) : (
            sessions.map((s) => (
              <div key={s.id} className="session-card">
                <p>
                  <strong>Start:</strong>{" "}
                  {parseSessionTime(s.start_time)?.toLocaleString()}
                </p>
                <p>
                  <strong>End:</strong>{" "}
                  {s.end_time
                    ? parseSessionTime(s.end_time)?.toLocaleString()
                    : "Still running"}
                </p>
                {s.duration != null && (
                  <p className="session-duration">
                    Duration: {formatDuration(s.duration)}
                  </p>
                )}
                <div className="session-actions">
                  <button
                    className="btn btn-delete"
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
              </div>
            ))
          )}
        </section>
      )}
    </div>
  );
}
