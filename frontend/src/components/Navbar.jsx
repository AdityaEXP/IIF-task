import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-logo" onClick={() => setOpen(false)}>
          Campus<span>Events</span>
        </Link>

        <button className="navbar-toggle" onClick={() => setOpen(!open)}>
          &#9776;
        </button>

        <nav className={`navbar-links ${open ? "open" : ""}`}>
          <Link to="/" onClick={() => setOpen(false)}>Home</Link>
          <Link to="/events" onClick={() => setOpen(false)}>Events</Link>
          <Link to="/schedule" onClick={() => setOpen(false)}>Schedule</Link>
          <Link to="/#contact" onClick={() => setOpen(false)}>Contact</Link>

          {user ? (
            <>
              {user.role === "admin" && (
                <Link to="/admin" onClick={() => setOpen(false)}>Admin</Link>
              )}
              <Link to="/dashboard" onClick={() => setOpen(false)}>Dashboard</Link>
              <button className="btn btn-outline navbar-btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" onClick={() => setOpen(false)}>
              <button className="btn btn-primary navbar-btn">Login / Signup</button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
