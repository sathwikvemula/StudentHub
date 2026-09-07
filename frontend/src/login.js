
import { useState } from "react";
import API from "./Api";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      // Send login request to Spring Boot
      const response = await API.post("/api/v1/auth/login", {
        email: email.trim(),
        password: password,
      });

      console.log("Login response:", response.data);

      // Get JWT token from backend response
      const token = response.data.token;

      if (!token) {
        setError("Login successful, but token was not received.");
        return;
      }

      // Store JWT
      localStorage.setItem("token", token);

      console.log("JWT stored successfully");

      // Tell App.js that login was successful
      onLogin(token);

    } catch (error) {
      console.error("Login error:", error);

      if (error.response) {
        setError(
          error.response.data?.message ||
          error.response.data ||
          "Invalid email or password."
        );
      } else if (error.request) {
        setError(
          "Cannot connect to the server. Please make sure Spring Boot is running."
        );
      } else {
        setError("Something went wrong. Please try again.");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "70vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "white",
          padding: "35px",
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        }}
      >

        {/* HEADER */}

        <div
          style={{
            textAlign: "center",
            marginBottom: "25px",
          }}
        >
          <h1
            style={{
              marginBottom: "8px",
            }}
          >
            Welcome Back 👋
          </h1>

          <p
            style={{
              color: "#6b7280",
              margin: 0,
            }}
          >
            Login to your StudentHub account
          </p>
        </div>

        {/* ERROR */}

        {error && (
          <div
            style={{
              background: "#fee2e2",
              color: "#991b1b",
              padding: "10px 12px",
              borderRadius: "6px",
              marginBottom: "20px",
              fontSize: "14px",
            }}
          >
            {error}
          </div>
        )}

        {/* FORM */}

        <form onSubmit={handleLogin}>

          {/* EMAIL */}

          <div
            style={{
              marginBottom: "18px",
            }}
          >
            <label
              style={{
                display: "block",
                marginBottom: "7px",
                fontWeight: "600",
              }}
            >
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          {/* PASSWORD */}

          <div
            style={{
              marginBottom: "22px",
            }}
          >
            <label
              style={{
                display: "block",
                marginBottom: "7px",
                fontWeight: "600",
              }}
            >
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          {/* LOGIN BUTTON */}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              margin: 0,
              fontSize: "15px",
              background: loading
                ? "#93c5fd"
                : "#2563eb",
              cursor: loading
                ? "not-allowed"
                : "pointer",
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>
      </div>
    </div>
  );
}

export default Login;
