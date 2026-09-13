import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import About from "../components/About";
import ContactForm from "../components/ContactForm";
import EventCard from "../components/EventCard";
import { api } from "../api";
import "./Home.css";

export default function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/events")
      .then((data) => setEvents(data.slice(0, 3)))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <Hero />
      <About />

      <section className="section" id="events" style={{ background: "#fff" }}>
        <div className="container">
          <h2 className="section-title">Upcoming Events</h2>
          <p className="section-subtitle">A quick look at what's coming up on campus.</p>

          {loading && <p style={{ textAlign: "center" }}>Loading events...</p>}
          {!loading && events.length === 0 && (
            <p style={{ textAlign: "center" }}>No events posted yet, check back soon.</p>
          )}

          <div className="home-events-grid">
            {events.map((ev) => (
              <EventCard key={ev.id} event={ev} />
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: 30 }}>
            <Link to="/events">
              <button className="btn btn-primary">View All Events</button>
            </Link>
          </div>
        </div>
      </section>

      <ContactForm />
    </div>
  );
}
