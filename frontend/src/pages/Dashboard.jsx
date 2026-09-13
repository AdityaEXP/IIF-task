import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../api";
import "./Dashboard.css";

export default function Dashboard() {
  const { user, token } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  async function loadRegistrations() {
    setLoading(true);
    try {
      const data = await api.get("/registrations/me", token);
      setRegistrations(data);
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRegistrations();
  }, []);

  async function handleCancel(eventId) {
    if (!window.confirm("Cancel your registration for this event?")) return;

    try {
      await api.del(`/registrations/${eventId}`, token);
      setRegistrations((prev) => prev.filter((r) => r.event_id !== eventId));
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    }
  }

  return (
    <div className="page-wrap">
      <div className="container">
        <h1 className="section-title">My Dashboard</h1>
        <p className="section-subtitle">Welcome back, {user?.username}. Here are your registrations.</p>

        {message && <div className="alert alert-error">{message.text}</div>}

        {loading && <p style={{ textAlign: "center" }}>Loading...</p>}

        {!loading && registrations.length === 0 && (
          <div className="dashboard-empty">
            <p>You haven't registered for any events yet.</p>
            <Link to="/events">
              <button className="btn btn-primary">Browse Events</button>
            </Link>
          </div>
        )}

        <div className="dashboard-list">
          {registrations.map((r) => (
            <div className="dashboard-item" key={r.id}>
              <div>
                <h3>{r.title}</h3>
                <p>
                  {r.event_date} &middot; {r.event_time} &middot; {r.location}
                </p>
              </div>
              <button className="btn btn-outline" onClick={() => handleCancel(r.event_id)}>
                Cancel
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
