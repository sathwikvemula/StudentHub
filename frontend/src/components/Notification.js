
function Notification({ message, onClose }) {
  // Don't display anything when there is no notification
  if (!message) {
    return null;
  }

  return (
    <div
      style={{
        background: "#fff7ed",
        border: "1px solid #fed7aa",
        padding: "16px",
        borderRadius: "10px",
        marginBottom: "25px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "15px",
        }}
      >


        <div>
          <strong>🔔 Reminder</strong>

          <p
            style={{
              marginBottom: 0,
              marginTop: "7px",
            }}
          >
            {message}
          </p>
        </div>


        <button
          onClick={onClose}
          style={{
            background: "#6b7280",
            color: "white",
            border: "none",
            padding: "7px 12px",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default Notification;
