import "./EventCard.css";

export default function EventCard({ event, isRegistered, onRegister, registering }) {
  const isFull = event.capacity !== null && event.registered_count >= event.capacity;

  let buttonLabel = "Register";
  if (isRegistered) buttonLabel = "Registered";
  else if (isFull) buttonLabel = "Full";
  else if (registering) buttonLabel = "Registering...";

  return (
    <div className="event-card">
      <div className="event-card-top">
        <span className="event-category">{event.category}</span>
        <span className="event-date">
          {event.event_date} &middot; {event.event_time}
        </span>
      </div>

      <h3>{event.title}</h3>
      <p className="event-desc">{event.description}</p>

      <div className="event-meta">
        <span>{event.location}</span>
        <span>
          {event.registered_count}
          {event.capacity !== null ? ` / ${event.capacity}` : ""} registered
        </span>
      </div>

      {onRegister && (
        <button
          className={`btn ${isRegistered ? "btn-outline" : "btn-accent"} event-btn`}
          disabled={isRegistered || isFull || registering}
          onClick={() => onRegister(event)}
        >
          {buttonLabel}
        </button>
      )}
    </div>
  );
}
