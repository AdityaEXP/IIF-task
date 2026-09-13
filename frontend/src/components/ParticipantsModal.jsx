import { useEffect, useState } from "react";
import Modal from "./Modal";
import { useAuth } from "../context/AuthContext";
import { api } from "../api";

export default function ParticipantsModal({ event, onClose }) {
  const { token } = useAuth();
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get(`/events/${event.id}/participants`, token)
      .then(setParticipants)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [event.id]);

  return (
    <Modal title={`Participants - ${event.title}`} onClose={onClose}>
      {loading && <p>Loading...</p>}
      {error && <div className="alert alert-error">{error}</div>}

      {!loading && !error && participants.length === 0 && <p>No one has registered yet.</p>}

      <ul className="participants-list">
        {participants.map((p) => (
          <li key={p.id}>
            <strong>{p.username}</strong>
            <span>{p.email}</span>
          </li>
        ))}
      </ul>
    </Modal>
  );
}
