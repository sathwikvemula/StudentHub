
import { useState } from "react";

import Register from "./Register";
import Login from "./login";
import Dashboard from "./Dashboard";
import Notes from "./Notes";
import Navbar from "./components/Navbar";

function App() {

  // Store token in React state
  const [token, setToken] = useState(
    localStorage.getItem("token")
  );

  const [view, setView] = useState(
    token ? "dashboard" : "login"
  );

  const handleLogin = (newToken) => {

    // Save token in localStorage
    localStorage.setItem("token", newToken);

    // Update React state
    setToken(newToken);

    // Go to dashboard
    setView("dashboard");
  };

  const handleLogout = () => {

    localStorage.removeItem("token");

    // Update React state
    setToken(null);

    // Go to login
    setView("login");
  };


  const goTo = (page) => {
    setView(page);
  };


  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
      }}
    >

      <Navbar
        token={token}
        view={view}
        goTo={goTo}
        handleLogout={handleLogout}
      />
      <main
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "30px 20px",
        }}
      >

        {!token && view === "login" && (
          <Login
            onLogin={handleLogin}
          />
        )}


        {!token && view === "register" && (
          <Register />
        )}

        {token && view === "dashboard" && (
          <Dashboard />
        )}


        {token && view === "notes" && (
          <Notes />
        )}

        {!token &&
          view !== "login" &&
          view !== "register" && (
            <Login
              onLogin={handleLogin}
            />
          )}

      </main>

    </div>
  );
}

export default App;
