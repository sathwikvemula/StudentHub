function Navbar({ view, goTo, token, handleLogout }) {
  return (
    <nav
      style={{
        background: "#111827",
        color: "white",
        padding: "15px 25px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "15px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      <div>
        <h2
          style={{
            margin: 0,
            color: "white",
            cursor: "pointer",
          }}
          onClick={() => goTo(token ? "dashboard" : "login")}
        >
          StudentHub
        </h2>

        <small
          style={{
            color: "#9ca3af",
          }}
        >
          Smart Student Notes
        </small>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "8px",
        }}
      >
        {token ? (
          <>
            <button
              onClick={() => goTo("dashboard")}
              style={{
                background:
                  view === "dashboard" ? "#2563eb" : "#374151",
                color: "white",
                border: "none",
                padding: "10px 16px",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Dashboard
            </button>

            <button
              onClick={() => goTo("notes")}
              style={{
                background:
                  view === "notes" ? "#2563eb" : "#374151",
                color: "white",
                border: "none",
                padding: "10px 16px",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              My Notes
            </button>

            <button
              onClick={handleLogout}
              style={{
                background: "#dc2626",
                color: "white",
                border: "none",
                padding: "10px 16px",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => goTo("login")}
              style={{
                background:
                  view === "login" ? "#2563eb" : "#374151",
                color: "white",
                border: "none",
                padding: "10px 16px",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Login
            </button>

            <button
              onClick={() => goTo("register")}
              style={{
                background:
                  view === "register" ? "#2563eb" : "#374151",
                color: "white",
                border: "none",
                padding: "10px 16px",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Register
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;