
function NoteCard({ note, onEdit, onDelete }) {
  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: "12px",
        padding: "20px",
        background: "#fafafa",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
      }}
    >
    

      <h3
        style={{
          marginTop: 0,
          marginBottom: "10px",
        }}
      >
        {note.title}
      </h3>



      <p
        style={{
          color: "#4b5563",
          lineHeight: "1.6",
          whiteSpace: "pre-wrap",
        }}
      >
        {note.content}
      </p>



      <p>
        <strong>Category:</strong>{" "}
        {note.category || "None"}
      </p>


      <p>
        <strong>Priority:</strong>{" "}
        <span
          style={{
            fontWeight: "600",
          }}
        >
          {note.priority}
        </span>
      </p>



      <p>
        <strong>Status:</strong>{" "}

        {note.completed ? (
          <span
            style={{
              color: "#16a34a",
              fontWeight: "600",
            }}
          >
            ✓ Completed
          </span>
        ) : (
          <span
            style={{
              color: "#ea580c",
              fontWeight: "600",
            }}
          >
            ⏳ Pending
          </span>
        )}
      </p>


      {note.deadline && (
        <p>
          <strong>Deadline:</strong>{" "}
          {note.deadline}
        </p>
      )}



      <div
        style={{
          marginTop: "15px",
          display: "flex",
          gap: "10px",
        }}
      >
        <button
          onClick={() => onEdit(note)}
        >
          ✏️ Edit
        </button>

        <button
          onClick={() => onDelete(note.id)}
          style={{
            background: "#dc2626",
            color: "white",
          }}
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  );
}

export default NoteCard;
