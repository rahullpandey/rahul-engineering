"use client";

import { useState } from "react";

export default function AdminLoginPage({ searchParams }) {
  const error = searchParams?.error;
  const redirect = searchParams?.redirect || "/admin";
  const [showPassword, setShowPassword] = useState(false);
  const message =
    error === "invalid"
      ? "Invalid admin ID or password."
      : error === "setup"
        ? "Admin login is not configured yet."
        : "";

  return (
    <main className="container">
      <div className="login-card">
        <h1 style={{ marginBottom: "0.6rem" }}>Admin Login</h1>
        <p style={{ color: "var(--muted)", marginBottom: "1.4rem" }}>
          Sign in to manage employees and hotel projects.
        </p>
        {message ? (
          <div
            style={{
              background: "#fff1e6",
              border: "1px solid #f0c9a9",
              padding: "0.8rem 1rem",
              borderRadius: "12px",
              marginBottom: "1rem",
              color: "#8a3e0c",
              fontWeight: 600
            }}
          >
            {message}
          </div>
        ) : null}
        <form method="post" action="/api/auth/login">
          <input type="hidden" name="redirect" value={redirect} />
          <label htmlFor="username">Admin ID</label>
          <input id="username" name="username" type="text" placeholder="Enter admin ID" required />
          <label htmlFor="password">Password</label>
          <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              required
              style={{ paddingRight: "3rem" }}
            />
            <button
              type="button"
              className="eye-button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              style={{
                position: "absolute",
                right: "0.65rem",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: 0
              }}
            >
              <span className={showPassword ? "eye-icon active" : "eye-icon"} />
            </button>
          </div>
          <div style={{ marginTop: "1.4rem" }}>
            <button
              className="button primary"
              type="submit"
              style={{ width: "100%", justifyContent: "center" }}
            >
              Enter Dashboard
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
