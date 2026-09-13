import { Link } from "react-router-dom";
import "./Hero.css";

export default function Hero() {
  return (
    <section className="hero" id="home">
      <div className="container hero-inner">
        <h1>
          Discover. Register. <span>Participate.</span>
        </h1>
        <p>
          One place for every workshop, fest and competition happening on campus.
          Find events that interest you and register in a couple of clicks.
        </p>
        <div className="hero-actions">
          <Link to="/events">
            <button className="btn btn-accent">Browse Events</button>
          </Link>
          <Link to="/signup">
            <button className="btn btn-outline hero-outline">Create Account</button>
          </Link>
        </div>
      </div>
    </section>
  );
}
