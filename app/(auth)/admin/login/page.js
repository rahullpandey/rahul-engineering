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
          <div style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              required
            />
            <button
              type="button"
              className="button ghost"
              onClick={() => setShowPassword((prev) => !prev)}
              style={{ padding: "0.6rem 1rem", whiteSpace: "nowrap" }}
            >
              {showPassword ? "Hide" : "Show"}
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
