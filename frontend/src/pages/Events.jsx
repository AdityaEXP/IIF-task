import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EventCard from "../components/EventCard";
import { useAuth } from "../context/AuthContext";
import { api } from "../api";
import "./Events.css";

const CATEGORIES = ["All", "Technical", "Cultural", "Sports", "Workshop", "Seminar", "Other"];

export default function Events() {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [myEventIds, setMyEventIds] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [registeringId, setRegisteringId] = useState(null);

  async function loadEvents() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.append("search", search.trim());
      if (category !== "All") params.append("category", category);

      const query = params.toString() ? `?${params.toString()}` : "";
      const data = await api.get(`/events${query}`);
      setEvents(data);
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  }

  async function loadMyRegistrations() {
    if (!token) {
      setMyEventIds([]);
      return;
    }
    try {
      const data = await api.get("/registrations/me", token);
      setMyEventIds(data.map((r) => r.event_id));
    } catch {
      setMyEventIds([]);
    }
  }

  useEffect(() => {
    loadEvents();
  }, [search, category]);

  useEffect(() => {
    loadMyRegistrations();
  }, [token]);

  async function handleRegister(event) {
    if (!user) {
      navigate("/login");
      return;
    }

    setMessage(null);
    setRegisteringId(event.id);
    try {
      await api.post("/registrations", { event_id: event.id }, token);
      setMessage({ type: "success", text: `Registered for "${event.title}"` });
      setMyEventIds((prev) => [...prev, event.id]);
      loadEvents();
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setRegisteringId(null);
    }
  }

  return (
    <div className="page-wrap">
      <div className="container">
        <h1 className="section-title">Events</h1>
        <p className="section-subtitle">Search and filter events happening across campus.</p>

        {message && (
          <div className={`alert ${message.type === "error" ? "alert-error" : "alert-success"}`}>
            {message.text}
          </div>
        )}

        <div className="events-filters">
          <input
            className="form-control"
            placeholder="Search events by title or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="form-control events-category-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {loading && <p style={{ textAlign: "center" }}>Loading events...</p>}
        {!loading && events.length === 0 && (
          <p style={{ textAlign: "center" }}>No events match your search.</p>
        )}

        <div className="events-grid">
          {events.map((ev) => (
            <EventCard
              key={ev.id}
              event={ev}
              isRegistered={myEventIds.includes(ev.id)}
              registering={registeringId === ev.id}
              onRegister={handleRegister}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
