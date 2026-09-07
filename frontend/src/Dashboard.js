import { useEffect, useState, useCallback } from "react";
import API from "./Api";

import {
  connectWebSocket,
  disconnectWebSocket,
} from "./WebSocketService";

import "./Dashboard.css";

import StatCard from "./components/StatCard";
import Notification from "./components/Notification";
import NoteCard from "./components/NoteCard";

function Dashboard() {

  const [user, setUser] = useState(null);

  const [notes, setNotes] = useState([]);

  const [smartTasks, setSmartTasks] = useState([]);

  const [stats, setStats] = useState({
    categoryCounts: {},
    completed: 0,
    pending: 0,
  });


  const [keyword, setKeyword] = useState("");
  const [priority, setPriority] = useState("ALL");
  const [completedFilter, setCompletedFilter] = useState("ALL");


  const [editingNote, setEditingNote] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  const [notification, setNotification] = useState("");


  const fetchUser = useCallback(async () => {
    try {

      const response = await API.get(
        "/api/v1/auth/me"
      );

      setUser(response.data);
      setError("");

    } catch (error) {

      console.error("User error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to load user information."
      );
    }

  }, []);

  const fetchNotes = useCallback(async () => {
    try {

      const response = await API.get(
        "/api/v1/notes/my"
      );

      setNotes(response.data);
      setError("");

    } catch (error) {

      console.error("Notes error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to load notes."
      );
    }

  }, []);

  const fetchStats = useCallback(async () => {
    try {

      const response = await API.get(
        "/api/v1/notes/dashboard"
      );

      setStats(response.data);
      setError("");

    } catch (error) {

      console.error("Stats error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to load dashboard statistics."
      );
    }

  }, []);


  const fetchSmartTasks = useCallback(async () => {
    try {

      const response = await API.get(
        "/api/v1/notes/smart"
      );

      console.log(
        "SMART TASKS FROM API:",
        response.data
      );

      setSmartTasks(response.data);
      setError("");

    } catch (error) {

      console.error(
        "Smart tasks error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to load smart tasks."
      );
    }

  }, []);


  const refreshDashboard = useCallback(async () => {

    await Promise.all([
      fetchUser(),
      fetchNotes(),
      fetchStats(),
      fetchSmartTasks(),
    ]);

  }, [
    fetchUser,
    fetchNotes,
    fetchStats,
    fetchSmartTasks,
  ]);

  useEffect(() => {

    const loadDashboard = async () => {

      setLoading(true);

      await refreshDashboard();

      setLoading(false);
    };

    loadDashboard();

  }, [refreshDashboard]);


  useEffect(() => {

    if (!user?.email) {
      return;
    }

    connectWebSocket(

      user.email,

      // PERSONAL REMINDER
      (message) => {

        console.log(
          "🔔 Reminder:",
          message
        );

        setNotification(message);
      },

      // NOTE UPDATE
      async (message) => {

        console.log(
          "🔄 Note update:",
          message
        );

        await Promise.all([
          fetchNotes(),
          fetchStats(),
          fetchSmartTasks(),
        ]);
      }

    );

    return () => {
      disconnectWebSocket();
    };

  }, [
    user,
    fetchNotes,
    fetchStats,
    fetchSmartTasks,
  ]);

  const searchNotes = async () => {

    const value = keyword.trim();

    if (value === "") {

      await fetchNotes();

      return;
    }

    try {

      setError("");

      const response = await API.get(
        `/api/v1/notes/search?keyword=${encodeURIComponent(
          value
        )}`
      );

      setNotes(response.data);

    } catch (error) {

      console.error(
        "Search error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to search notes."
      );
    }
  };

  const clearSearch = async () => {

    setKeyword("");
    setPriority("ALL");
    setCompletedFilter("ALL");

    await fetchNotes();
  };

  const filterPriority = async (value) => {

    setPriority(value);

    if (value === "ALL") {

      await fetchNotes();

      return;
    }

    try {

      setError("");

      const response = await API.get(
        `/api/v1/notes/priority?value=${value}`
      );

      setNotes(response.data);

    } catch (error) {

      console.error(
        "Priority filter error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to filter notes."
      );
    }
  };

  const filterCompleted = async (value) => {

    setCompletedFilter(value);

    if (value === "ALL") {

      await fetchNotes();

      return;
    }

    try {

      setError("");

      const response = await API.get(
        `/api/v1/notes/completed?value=${value}`
      );

      setNotes(response.data);

    } catch (error) {

      console.error(
        "Status filter error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to filter notes."
      );
    }
  };

  const startEdit = (note) => {

    setEditingNote({

      id: note.id,

      title: note.title || "",

      content: note.content || "",

      category: note.category || "",

      priority: note.priority || "LOW",

      deadline: note.deadline
        ? note.deadline.slice(0, 16)
        : "",

      completed: Boolean(
        note.completed
      ),
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


  const updateNote = async () => {

    if (!editingNote) {
      return;
    }

    if (!editingNote.title.trim()) {

      alert("Title is required.");

      return;
    }

    if (!editingNote.content.trim()) {

      alert("Content is required.");

      return;
    }

    try {

      await API.put(
        `/api/v1/notes/${editingNote.id}`,
        {
          title:
            editingNote.title.trim(),

          content:
            editingNote.content.trim(),

          category:
            editingNote.category.trim(),

          priority:
            editingNote.priority,

          deadline:
            editingNote.deadline || null,

          completed:
            editingNote.completed,
        }
      );

      alert(
        "Note updated successfully!"
      );

      setEditingNote(null);

      await Promise.all([
        fetchNotes(),
        fetchStats(),
        fetchSmartTasks(),
      ]);

    } catch (error) {

      console.error(
        "Update error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to update note."
      );
    }
  };
  const deleteNote = async (id) => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this note?"
      );

    if (!confirmDelete) {
      return;
    }

    try {

      await API.delete(
        `/api/v1/notes/${id}`
      );

      alert(
        "Note deleted successfully!"
      );

      await Promise.all([
        fetchNotes(),
        fetchStats(),
        fetchSmartTasks(),
      ]);

    } catch (error) {

      console.error(
        "Delete error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to delete note."
      );
    }
  };
  const totalNotes =
    Number(stats.completed || 0) +
    Number(stats.pending || 0);

  if (loading) {

    return (
      <div className="dashboard-loading">

        <div className="loading-spinner"></div>

        <h2>
          Loading Dashboard...
        </h2>

        <p>
          Preparing your notes and tasks.
        </p>

      </div>
    );
  }

  return (

    <div className="dashboard-page">

      <section className="dashboard-header">

        <div>

          <p className="dashboard-eyebrow">
            STUDENTHUB
          </p>

          <h1>
            Student Dashboard
          </h1>

          {user && (
            <p className="welcome-text">

              Welcome back{" "}

              <strong>
                {user.firstName}
              </strong>

              {" "}👋

            </p>
          )}

        </div>

        {user && (
          <div className="user-email">
            {user.email}
          </div>
        )}

      </section>

      {error && (

        <div className="dashboard-error">

          <strong>
            Error:
          </strong>{" "}

          {error}

        </div>

      )}


      <Notification
        message={notification}
        onClose={() =>
          setNotification("")
        }
      />

      <section className="stats-grid">

        <StatCard
          title="Total Notes"
          value={totalNotes}
          icon="📝"
        />

        <StatCard
          title="Completed"
          value={stats.completed}
          color="#16a34a"
          icon="✓"
        />

        <StatCard
          title="Pending"
          value={stats.pending}
          color="#ea580c"
          icon="⏳"
        />

      </section>

      <section className="dashboard-panel">

        <div className="panel-heading">

          <div>

            <h2>
              Find Your Notes
            </h2>

            <p>
              Search and filter your notes quickly.
            </p>

          </div>

        </div>

        {/* SEARCH */}

        <div className="search-row">

          <div className="search-input-wrapper">

            <span>
              🔍
            </span>

            <input
              type="text"
              placeholder="Search title or content..."
              value={keyword}
              onChange={(e) =>
                setKeyword(
                  e.target.value
                )
              }
              onKeyDown={(e) => {

                if (e.key === "Enter") {
                  searchNotes();
                }

              }}
            />

          </div>

          <button
            className="primary-button"
            onClick={searchNotes}
          >
            Search
          </button>

          <button
            className="secondary-button"
            onClick={clearSearch}
          >
            Clear
          </button>

        </div>

        {/* FILTERS */}

        <div className="filter-row">

          <div className="filter-group">

            <label>
              Priority
            </label>

            <select
              value={priority}
              onChange={(e) =>
                filterPriority(
                  e.target.value
                )
              }
            >

              <option value="ALL">
                All priorities
              </option>

              <option value="LOW">
                Low
              </option>

              <option value="MEDIUM">
                Medium
              </option>

              <option value="HIGH">
                High
              </option>

            </select>

          </div>

          <div className="filter-group">

            <label>
              Status
            </label>

            <select
              value={completedFilter}
              onChange={(e) =>
                filterCompleted(
                  e.target.value
                )
              }
            >

              <option value="ALL">
                All statuses
              </option>

              <option value="true">
                Completed
              </option>

              <option value="false">
                Pending
              </option>

            </select>

          </div>

        </div>

      </section>

      <section className="dashboard-panel">

        <div className="panel-heading">

          <div>

            <h2>
              Categories
            </h2>

            <p>
              Your notes grouped by category.
            </p>

          </div>

        </div>

        {Object.keys(
          stats.categoryCounts || {}
        ).length === 0 ? (

          <div className="empty-small">
            No categories found.
          </div>

        ) : (

          <div className="category-list">

            {Object.entries(
              stats.categoryCounts || {}
            ).map(
              ([category, count]) => (

                <div
                  key={category}
                  className="category-chip"
                >

                  <span>
                    {category}
                  </span>

                  <strong>
                    {count}
                  </strong>

                </div>

              )
            )}

          </div>

        )}

      </section>

      <section className="smart-section">

        <div className="smart-header">

          <div>

            <div className="smart-title-row">

              <span className="smart-icon">
                🧠
              </span>

              <h2>
                Smart Tasks
              </h2>

            </div>

            <p>
              Your most important tasks based on
              urgency and deadline.
            </p>

          </div>

          <span className="smart-count">
            {smartTasks.length} tasks
          </span>

        </div>

        {smartTasks.length === 0 ? (

          <div className="smart-empty">

            <div className="smart-empty-icon">
              ✓
            </div>

            <h3>
              You're all caught up!
            </h3>

            <p>
              No urgent tasks require your attention.
            </p>

          </div>

        ) : (

          <div className="smart-task-list">

            {smartTasks
              .slice(0, 3)
              .map((task) => (

                <div
                  key={task.id}
                  className={`smart-task-card ${
                    task.status?.toLowerCase() || ""
                  }`}
                >

                  <div className="smart-task-left">

                    <div className="smart-task-title-row">

                      <h3>
                        {task.title}
                      </h3>

                      <span className="smart-priority">
                        {task.priority}
                      </span>

                    </div>

                    <span className="smart-category">
                      {task.category}
                    </span>

                    <p className="smart-deadline">

                      <span>
                        📅
                      </span>

                      {task.deadline
                        ? new Date(
                            task.deadline
                          ).toLocaleString()
                        : "No deadline"}

                    </p>

                  </div>

                  <div className="smart-task-right">

                    <span
                      className={`smart-status ${
                        task.status?.toLowerCase() || ""
                      }`}
                    >

                      {task.status === "OVERDUE"
                        ? "🔴 OVERDUE"
                        : task.status === "DUE_SOON"
                        ? "🟠 DUE SOON"
                        : task.status === "UPCOMING"
                        ? "🟢 UPCOMING"
                        : "⚪ NORMAL"}

                    </span>

                    <div className="score-box">

                      <span>
                        Urgency
                      </span>

                      <strong>
                        {task.urgencyScore}
                      </strong>

                    </div>

                  </div>

                </div>

              ))}

          </div>

        )}

      </section>

      {editingNote && (

        <section className="dashboard-panel edit-panel">

          <div className="panel-heading">

            <div>

              <h2>
                ✏️ Edit Note
              </h2>

              <p>
                Update your note details.
              </p>

            </div>

          </div>

          <div className="edit-form">

            <div className="form-group">

              <label>
                Title
              </label>

              <input
                type="text"
                value={editingNote.title}
                onChange={(e) =>
                  setEditingNote({
                    ...editingNote,
                    title: e.target.value,
                  })
                }
              />

            </div>

            <div className="form-group">

              <label>
                Content
              </label>

              <textarea
                rows="5"
                value={editingNote.content}
                onChange={(e) =>
                  setEditingNote({
                    ...editingNote,
                    content: e.target.value,
                  })
                }
              />

            </div>

            <div className="edit-grid">

              <div className="form-group">

                <label>
                  Category
                </label>

                <input
                  type="text"
                  value={editingNote.category}
                  onChange={(e) =>
                    setEditingNote({
                      ...editingNote,
                      category: e.target.value,
                    })
                  }
                />

              </div>

              <div className="form-group">

                <label>
                  Priority
                </label>

                <select
                  value={editingNote.priority}
                  onChange={(e) =>
                    setEditingNote({
                      ...editingNote,
                      priority: e.target.value,
                    })
                  }
                >

                  <option value="LOW">
                    LOW
                  </option>

                  <option value="MEDIUM">
                    MEDIUM
                  </option>

                  <option value="HIGH">
                    HIGH
                  </option>

                </select>

              </div>

            </div>

            <div className="form-group">

              <label>
                Deadline
              </label>

              <input
                type="datetime-local"
                value={editingNote.deadline}
                onChange={(e) =>
                  setEditingNote({
                    ...editingNote,
                    deadline: e.target.value,
                  })
                }
              />

            </div>

            <label className="completed-checkbox">

              <input
                type="checkbox"
                checked={editingNote.completed}
                onChange={(e) =>
                  setEditingNote({
                    ...editingNote,
                    completed:
                      e.target.checked,
                  })
                }
              />

              <span>
                Mark as completed
              </span>

            </label>

            <div className="edit-actions">

              <button
                className="primary-button"
                onClick={updateNote}
              >
                Save Changes
              </button>

              <button
                className="secondary-button"
                onClick={() =>
                  setEditingNote(null)
                }
              >
                Cancel
              </button>

            </div>

          </div>

        </section>

      )}

      <section className="dashboard-panel notes-panel">

        <div className="notes-heading">

          <div>

            <h2>
              My Notes
            </h2>

            <p>
              All your notes in one place.
            </p>

          </div>

          <span className="notes-count">
            {notes.length} shown
          </span>

        </div>

        {notes.length === 0 ? (

          <div className="notes-empty">

            <div className="notes-empty-icon">
              📝
            </div>

            <h3>
              No notes found
            </h3>

            <p>
              Try changing your search or filters.
            </p>

          </div>

        ) : (

          <div className="notes-grid">

            {notes.map((note) => (

              <NoteCard
                key={note.id}
                note={note}
                onEdit={startEdit}
                onDelete={deleteNote}
              />

            ))}

          </div>

        )}

      </section>

    </div>
  );
}

export default Dashboard;