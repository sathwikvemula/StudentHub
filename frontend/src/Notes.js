
import { useEffect, useState } from "react";
import API from "./Api";
import "./Notes.css";

function Notes() {
  const [notes, setNotes] = useState([]);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [deadline, setDeadline] = useState("");
  const [priority, setPriority] = useState("LOW");
  const [completed, setCompleted] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchNotes = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/api/v1/notes/my");

      setNotes(response.data);
    } catch (error) {
      console.error("Error fetching notes:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load notes."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    fetchNotes();
  }, []);

  // =========================================================
  // CREATE / UPDATE
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Title is required.");
      return;
    }

    if (!content.trim()) {
      setError("Content is required.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const noteData = {
        title: title.trim(),
        content: content.trim(),
        category: category.trim(),
        deadline: deadline || null,
        completed,
        priority,
      };

      if (editingId) {
        await API.put(
          `/api/v1/notes/${editingId}`,
          noteData
        );

        alert("Note updated successfully!");
      } else {
        await API.post(
          "/api/v1/notes",
          noteData
        );

        alert("Note created successfully!");
      }

      clearForm();
      await fetchNotes();
    } catch (error) {
      console.error("Note operation error:", error);

      setError(
        error.response?.data?.message ||
          "Operation failed."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // DELETE
  // =========================================================

  const deleteNote = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this note?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      await API.delete(`/api/v1/notes/${id}`);

      alert("Note deleted successfully!");

      await fetchNotes();
    } catch (error) {
      console.error("Delete error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to delete note."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // EDIT
  // =========================================================

  const editNote = (note) => {
    setEditingId(note.id);

    setTitle(note.title || "");
    setContent(note.content || "");
    setCategory(note.category || "");
    setPriority(note.priority || "LOW");
    setCompleted(Boolean(note.completed));

    if (note.deadline) {
      setDeadline(note.deadline.slice(0, 16));
    } else {
      setDeadline("");
    }

    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================================================
  // CLEAR FORM
  // =========================================================

  const clearForm = () => {
    setEditingId(null);
    setTitle("");
    setContent("");
    setCategory("");
    setDeadline("");
    setPriority("LOW");
    setCompleted(false);
    setError("");
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="notes-page">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div className="notes-header">
        <p className="notes-label">
          MY NOTES
        </p>

        <h1>
          {editingId
            ? "Edit your note"
            : "Create a new note"}
        </h1>

        <p className="notes-description">
          Organize your study notes, tasks and
          deadlines in one place.
        </p>
      </div>

      {error && (
        <div className="notes-error">
          <strong>Error:</strong> {error}
        </div>
      )}

      <div className="note-form-card">

        <div className="note-form-header">
          <div>
            <h2>
              {editingId
                ? "✏️ Update Note"
                : "📝 New Note"}
            </h2>

            <p>
              {editingId
                ? "Make changes to your note."
                : "Add something you want to remember."}
            </p>
          </div>

          {editingId && (
            <button
              type="button"
              onClick={clearForm}
              disabled={loading}
              className="cancel-btn"
            >
              Cancel
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit}>

          {/* TITLE */}

          <div className="note-form-group">
            <label>
              Note Title
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              placeholder="Example: Java OOP Concepts"
              required
            />
          </div>

          {/* CONTENT */}

          <div className="note-form-group">
            <label>
              Content
            </label>

            <textarea
              value={content}
              onChange={(e) =>
                setContent(e.target.value)
              }
              placeholder="Write your note here..."
              rows="8"
              required
            />
          </div>

          {/* CATEGORY + PRIORITY */}

          <div className="note-form-row">

            {/* CATEGORY */}

            <div className="note-form-group">
              <label>
                Category
              </label>

              <input
                type="text"
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value)
                }
                placeholder="DSA, Java, DBMS..."
              />
            </div>

            {/* PRIORITY */}

            <div className="note-form-group">
              <label>
                Priority
              </label>

              <select
                value={priority}
                onChange={(e) =>
                  setPriority(e.target.value)
                }
              >
                <option value="LOW">
                  🟢 Low
                </option>

                <option value="MEDIUM">
                  🟡 Medium
                </option>

                <option value="HIGH">
                  🔴 High
                </option>
              </select>
            </div>

          </div>

          {/* DEADLINE */}

          <div className="note-form-group">
            <label>
              📅 Deadline
            </label>

            <input
              type="datetime-local"
              value={deadline}
              onChange={(e) =>
                setDeadline(e.target.value)
              }
              className="deadline-input"
            />

            <p className="deadline-help">
              Set a deadline if this note is
              related to a task or assignment.
            </p>
          </div>

          {/* COMPLETED */}

          <div className="completed-box">
            <label className="completed-label">

              <input
                type="checkbox"
                checked={completed}
                onChange={(e) =>
                  setCompleted(
                    e.target.checked
                  )
                }
              />

              <span>
                Mark this note as completed
              </span>

            </label>
          </div>

          {/* SUBMIT */}

          <button
            type="submit"
            disabled={loading}
            className="note-submit-btn"
          >
            {loading
              ? "Saving..."
              : editingId
              ? "✓ Update Note"
              : "+ Create Note"}
          </button>

        </form>
      </div>

      <div className="notes-list-header">

        <div>
          <h2>
            My Notes
          </h2>

          <p className="notes-count">
            {notes.length}{" "}
            {notes.length === 1
              ? "note"
              : "notes"}
          </p>
        </div>

        <button
          onClick={fetchNotes}
          disabled={loading}
          className="refresh-btn"
        >
          🔄 Refresh
        </button>

      </div>


      {loading && notes.length === 0 && (
        <div className="notes-loading">
          <h3>
            Loading your notes...
          </h3>

          <p>
            Please wait while we fetch your
            notes.
          </p>
        </div>
      )}

      {!loading && notes.length === 0 && (
        <div className="notes-empty">

          <div className="notes-empty-icon">
            📝
          </div>

          <h3>
            No notes yet
          </h3>

          <p>
            Create your first study note using
            the form above.
          </p>

        </div>
      )}

      {notes.length > 0 && (
        <div className="notes-grid">

          {notes.map((note) => (

            <div
              key={note.id}
              className="note-card"
            >

              {/* CARD HEADER */}

              <div className="note-card-header">

                <h3 className="note-card-title">
                  {note.title}
                </h3>

                <span
                  className={`priority-badge ${
                    note.priority === "HIGH"
                      ? "priority-high"
                      : note.priority === "MEDIUM"
                      ? "priority-medium"
                      : "priority-low"
                  }`}
                >
                  {note.priority}
                </span>

              </div>

              {/* CONTENT */}

              <p className="note-card-content">
                {note.content}
              </p>

              {/* DETAILS */}

              <div className="note-card-details">

                {/* CATEGORY */}

                <p className="note-detail">
                  <strong>
                    🏷️ Category:
                  </strong>{" "}
                  {note.category || "None"}
                </p>

                {/* STATUS */}

                <p className="note-detail">
                  <strong>
                    Status:
                  </strong>{" "}

                  {note.completed ? (
                    <span className="status-completed">
                      ✓ Completed
                    </span>
                  ) : (
                    <span className="status-pending">
                      ⏳ Pending
                    </span>
                  )}
                </p>

                {/* DEADLINE */}

                {note.deadline && (
                  <p className="note-detail">
                    <strong>
                      📅 Deadline:
                    </strong>{" "}
                    {new Date(
                      note.deadline
                    ).toLocaleString()}
                  </p>
                )}

              </div>

              {/* ACTIONS */}

              <div className="note-actions">

                <button
                  onClick={() =>
                    editNote(note)
                  }
                  className="note-edit-btn"
                >
                  ✏️ Edit
                </button>

                <button
                  onClick={() =>
                    deleteNote(note.id)
                  }
                  className="note-delete-btn"
                >
                  🗑️ Delete
                </button>

              </div>

            </div>

          ))}

        </div>
      )}

    </div>
  );
}

export default Notes;