import { useState } from "react";
import Modal from "./Modal";
import { useAuth } from "../context/AuthContext";
import { api } from "../api";

const CATEGORIES = ["Technical", "Cultural", "Sports", "Workshop", "Seminar", "Other"];

export default function EventFormModal({ initialData, onClose, onSaved }) {
  const { token } = useAuth();
  const isEdit = Boolean(initialData);

  const [form, setForm] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    category: initialData?.category || CATEGORIES[0],
    location: initialData?.location || "",
    event_date: initialData?.event_date || "",
    event_time: initialData?.event_time || "",
    capacity: initialData?.capacity ?? "",
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function validate() {
    const errs = {};
    if (form.title.trim().length < 3) errs.title = "Title should be at least 3 characters";
    if (!form.location.trim()) errs.location = "Location is required";
    if (!form.event_date) errs.event_date = "Date is required";
    if (!form.event_time.trim()) errs.event_time = "Time is required";
    if (form.capacity !== "" && Number(form.capacity) <= 0) errs.capacity = "Capacity must be a positive number";
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    setServerError("");
    if (Object.keys(errs).length > 0) return;

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category,
      location: form.location.trim(),
      event_date: form.event_date,
      event_time: form.event_time.trim(),
      capacity: form.capacity === "" ? null : Number(form.capacity),
    };

    setSubmitting(true);
    try {
      if (isEdit) {
        await api.put(`/events/${initialData.id}`, payload, token);
      } else {
        await api.post("/events", payload, token);
      }
      onSaved();
      onClose();
    } catch (err) {
      setServerError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal title={isEdit ? "Edit Event" : "Create Event"} onClose={onClose}>
      {serverError && <div className="alert alert-error">{serverError}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input className="form-control" name="title" value={form.title} onChange={handleChange} />
          {errors.title && <p className="error-text">{errors.title}</p>}
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            className="form-control"
            name="description"
            rows={3}
            value={form.description}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Category</label>
          <select className="form-control" name="category" value={form.category} onChange={handleChange}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Location</label>
          <input className="form-control" name="location" value={form.location} onChange={handleChange} />
          {errors.location && <p className="error-text">{errors.location}</p>}
        </div>

        <div className="form-group">
          <label>Date</label>
          <input
            className="form-control"
            type="date"
            name="event_date"
            value={form.event_date}
            onChange={handleChange}
          />
          {errors.event_date && <p className="error-text">{errors.event_date}</p>}
        </div>

        <div className="form-group">
          <label>Time</label>
          <input
            className="form-control"
            name="event_time"
            placeholder="e.g. 10:00 AM"
            value={form.event_time}
            onChange={handleChange}
          />
          {errors.event_time && <p className="error-text">{errors.event_time}</p>}
        </div>

        <div className="form-group">
          <label>Capacity (optional)</label>
          <input
            className="form-control"
            type="number"
            name="capacity"
            min="1"
            value={form.capacity}
            onChange={handleChange}
          />
          {errors.capacity && <p className="error-text">{errors.capacity}</p>}
        </div>

        <button className="btn btn-primary auth-submit" disabled={submitting}>
          {submitting ? "Saving..." : isEdit ? "Save Changes" : "Create Event"}
        </button>
      </form>
    </Modal>
  );
}
