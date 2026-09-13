import { useEffect, useState } from "react";
import { api } from "../api";
import "./Schedule.css";

export default function Schedule() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/events")
      .then(setEvents)
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, []);

  const grouped = events.reduce((acc, ev) => {
    if (!acc[ev.event_date]) acc[ev.event_date] = [];
    acc[ev.event_date].push(ev);
    return acc;
  }, {});

  const dates = Object.keys(grouped).sort();

  return (
    <div className="page-wrap">
      <div className="container">
        <h1 className="section-title">Event Schedule</h1>
        <p className="section-subtitle">All upcoming events, day by day.</p>

        {loading && <p style={{ textAlign: "center" }}>Loading schedule...</p>}
        {!loading && dates.length === 0 && (
          <p style={{ textAlign: "center" }}>No events scheduled yet.</p>
        )}

        <div className="timeline">
          {dates.map((date) => (
            <div className="timeline-day" key={date}>
              <div className="timeline-date">{date}</div>
              <div className="timeline-events">
                {grouped[date].map((ev) => (
                  <div className="timeline-card" key={ev.id}>
                    <span className="timeline-time">{ev.event_time}</span>
                    <div>
                      <h4>{ev.title}</h4>
                      <p>
                        {ev.category} &middot; {ev.location}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
