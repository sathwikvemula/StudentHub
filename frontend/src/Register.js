
import { useState } from "react";
import API from "./Api";

function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!firstName.trim()) {
      setError("First name is required.");
      return;
    }

    if (!lastName.trim()) {
      setError("Last name is required.");
      return;
    }

    if (!email.trim()) {
      setError("Email is required.");
      return;
    }

    if (!password) {
      setError("Password is required.");
      return;
    }

    if (password.length < 6) {
      setError(
        "Password must contain at least 6 characters."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await API.post(
        "/api/v1/auth/register",
        {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          password,
        }
      );

      console.log(
        "Registration response:",
        response.data
      );

      setSuccess(
        "Registration successful! Please check MailDev and confirm your email."
      );

      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");

    } catch (error) {
      console.error(
        "Registration error:",
        error
      );

      setError(
        error.response?.data?.message ||
          error.response?.data ||
          "Registration failed. Please try again."
      );

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
          maxWidth: "480px",

          background: "white",

          padding: "35px",

          borderRadius: "12px",

          boxShadow:
            "0 4px 20px rgba(0,0,0,0.08)",
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
            Create Account 🚀
          </h1>

          <p
            style={{
              color: "#6b7280",
              margin: 0,
            }}
          >
            Create your StudentHub account
          </p>
        </div>

        {/* SUCCESS */}

        {success && (
          <div
            style={{
              background: "#dcfce7",
              color: "#166534",

              padding: "12px",

              borderRadius: "6px",

              marginBottom: "20px",

              fontSize: "14px",
            }}
          >
            {success}
          </div>
        )}

        {/* ERROR */}

        {error && (
          <div
            style={{
              background: "#fee2e2",
              color: "#991b1b",

              padding: "12px",

              borderRadius: "6px",

              marginBottom: "20px",

              fontSize: "14px",
            }}
          >
            {error}
          </div>
        )}

        {/* FORM */}

        <form onSubmit={handleRegister}>
          {/* FIRST NAME */}

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
              First Name
            </label>

            <input
              type="text"
              placeholder="Enter your first name"
              value={firstName}
              onChange={(e) =>
                setFirstName(e.target.value)
              }
              autoComplete="given-name"
              required
            />
          </div>

          {/* LAST NAME */}

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
              Last Name
            </label>

            <input
              type="text"
              placeholder="Enter your last name"
              value={lastName}
              onChange={(e) =>
                setLastName(e.target.value)
              }
              autoComplete="family-name"
              required
            />
          </div>

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
              onChange={(e) =>
                setEmail(e.target.value)
              }
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
              placeholder="Create a password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              autoComplete="new-password"
              required
            />

            <small
              style={{
                display: "block",
                marginTop: "6px",
                color: "#6b7280",
              }}
            >
              Minimum 6 characters
            </small>
          </div>

          {/* REGISTER BUTTON */}

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
            {loading
              ? "Creating Account..."
              : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
