import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="page-wrap" style={{ textAlign: "center" }}>
      <h1 className="section-title">404</h1>
      <p className="section-subtitle">The page you are looking for does not exist.</p>
      <Link to="/">
        <button className="btn btn-primary">Go Home</button>
      </Link>
    </div>
  );
}
