import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../api";
import EventFormModal from "../components/EventFormModal";
import ParticipantsModal from "../components/ParticipantsModal";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const { token } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [viewingEvent, setViewingEvent] = useState(null);

  async function loadEvents() {
    setLoading(true);
    try {
      const data = await api.get("/events");
      setEvents(data);
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEvents();
  }, []);

  function openCreate() {
    setEditingEvent(null);
    setShowForm(true);
  }

  function openEdit(event) {
    setEditingEvent(event);
    setShowForm(true);
  }

  async function handleDelete(event) {
    if (!window.confirm(`Delete "${event.title}"? This cannot be undone.`)) return;

    try {
      await api.del(`/events/${event.id}`, token);
      setEvents((prev) => prev.filter((e) => e.id !== event.id));
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    }
  }

  return (
    <div className="page-wrap">
      <div className="container">
        <div className="admin-header">
          <div>
            <h1 className="section-title" style={{ textAlign: "left" }}>
              Organizer Dashboard
            </h1>
            <p className="section-subtitle" style={{ textAlign: "left", margin: 0 }}>
              Create, edit and track your events.
            </p>
          </div>
          <button className="btn btn-accent" onClick={openCreate}>
            + New Event
          </button>
        </div>

        {message && <div className="alert alert-error">{message.text}</div>}
        {loading && <p style={{ textAlign: "center" }}>Loading events...</p>}

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Date</th>
                <th>Registered</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((ev) => (
                <tr key={ev.id}>
                  <td>{ev.title}</td>
                  <td>{ev.category}</td>
                  <td>
                    {ev.event_date} {ev.event_time}
                  </td>
                  <td>
                    {ev.registered_count}
                    {ev.capacity !== null ? ` / ${ev.capacity}` : ""}
                  </td>
                  <td className="admin-actions">
                    <button className="btn btn-outline" onClick={() => setViewingEvent(ev)}>
                      Participants
                    </button>
                    <button className="btn btn-outline" onClick={() => openEdit(ev)}>
                      Edit
                    </button>
                    <button className="btn btn-danger" onClick={() => handleDelete(ev)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {!loading && events.length === 0 && (
            <p style={{ textAlign: "center", padding: "30px 0" }}>
              No events created yet. Click "New Event" to add one.
            </p>
          )}
        </div>
      </div>

      {showForm && (
        <EventFormModal
          initialData={editingEvent}
          onClose={() => setShowForm(false)}
          onSaved={loadEvents}
        />
      )}

      {viewingEvent && <ParticipantsModal event={viewingEvent} onClose={() => setViewingEvent(null)} />}
    </div>
  );
}
