"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AttendanceLogin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/attendance/check-in";

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [requestId, setRequestId] = useState("");
  const [step, setStep] = useState("phone");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const sendOtp = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/attendance/otp/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone })
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = await response.json();
      setRequestId(data.requestId || "");
      setStep("otp");
      setMessage("OTP sent. Please check your phone.");
    } catch (error) {
      setMessage(error.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/attendance/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp, requestId })
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      setMessage("Verified. Redirecting...");
      router.push(redirectTo);
    } catch (error) {
      setMessage(error.message || "OTP verification failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="attendance-shell">
      <div className="attendance-card card">
        <div className="attendance-title">Worker Attendance</div>
        <p className="attendance-subtitle">
          Sign in with OTP to mark your attendance.
        </p>
        {message && <div className="attendance-message">{message}</div>}
        {step === "phone" ? (
          <form onSubmit={sendOtp} className="attendance-form">
            <label className="attendance-label">
              Phone Number
              <input
                type="tel"
                inputMode="numeric"
                placeholder="Enter your mobile number"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                required
              />
            </label>
            <button className="button primary" type="submit" disabled={loading}>
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={verifyOtp} className="attendance-form">
            <label className="attendance-label">
              OTP
              <input
                type="text"
                inputMode="numeric"
                placeholder="Enter OTP"
                value={otp}
                onChange={(event) => setOtp(event.target.value)}
                required
              />
            </label>
            <div className="attendance-actions">
              <button className="button ghost" type="button" onClick={() => setStep("phone")}>
                Change Number
              </button>
              <button className="button primary" type="submit" disabled={loading}>
                {loading ? "Verifying..." : "Verify & Continue"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
