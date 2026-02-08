"use client";

import { useEffect, useMemo, useState } from "react";

const STATUS_OPTIONS = [
  { value: "PRESENT", label: "Present" },
  { value: "ABSENT", label: "Absent" },
  { value: "HALF_DAY", label: "Half day" }
];

function getTodayString() {
  return new Date().toLocaleDateString("en-CA");
}

export default function CheckInClient({ employee, hotels }) {
  const [status, setStatus] = useState("PRESENT");
  const [hotelId, setHotelId] = useState("");
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [locationStatus, setLocationStatus] = useState("Fetching location...");
  const [selfie, setSelfie] = useState(null);
  const [preview, setPreview] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const attendanceDate = useMemo(() => getTodayString(), []);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationStatus("Location not supported on this device.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocationStatus("Location captured.");
      },
      () => {
        setLocationStatus("Location permission denied.");
      },
      { enableHighAccuracy: true, timeout: 12000 }
    );
  }, []);

  const onSelfieChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      setSelfie(null);
      setPreview("");
      return;
    }
    setSelfie(file);
    setPreview(URL.createObjectURL(file));
  };

  const submitAttendance = async (event) => {
    event.preventDefault();
    setMessage("");

    if (!selfie) {
      setMessage("Selfie is required.");
      return;
    }

    if (location.lat == null || location.lng == null) {
      setMessage("Location permission is required.");
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("status", status);
      formData.append("attendanceDate", attendanceDate);
      formData.append("hotelId", hotelId);
      formData.append("latitude", location.lat);
      formData.append("longitude", location.lng);
      formData.append("selfie", selfie);

      const response = await fetch("/api/attendance/check-in", {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      setMessage("Attendance submitted successfully.");
    } catch (error) {
      setMessage(error.message || "Failed to submit attendance.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="attendance-shell">
      <div className="attendance-card card">
        <div className="attendance-title">Mark Attendance</div>
        <p className="attendance-subtitle">
          Welcome, {employee?.name || "Worker"}. Submit your attendance for {attendanceDate}.
        </p>
        <div className="attendance-message">{locationStatus}</div>
        {message && <div className="attendance-message">{message}</div>}
        <form className="attendance-form" onSubmit={submitAttendance}>
          <label className="attendance-label">
            Status
            <select value={status} onChange={(event) => setStatus(event.target.value)}>
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="attendance-label">
            Hotel (optional)
            <select value={hotelId} onChange={(event) => setHotelId(event.target.value)}>
              <option value="">Select hotel</option>
              {hotels?.map((hotel) => (
                <option key={hotel.id} value={hotel.id}>
                  {hotel.name}
                </option>
              ))}
            </select>
          </label>
          <label className="attendance-label">
            Selfie
            <input
              type="file"
              accept="image/*"
              capture="user"
              onChange={onSelfieChange}
              required
            />
          </label>
          {preview && (
            <div className="attendance-preview">
              <img src={preview} alt="Selfie preview" />
            </div>
          )}
          <button className="button primary" type="submit" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Attendance"}
          </button>
        </form>
      </div>
    </div>
  );
}
