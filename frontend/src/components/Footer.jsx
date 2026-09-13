import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <p>&copy; {new Date().getFullYear()} Campus Events Society. All rights reserved.</p>
        <p>Made for students, by students.</p>
      </div>
    </footer>
  );
}
