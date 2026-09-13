import "./About.css";

const points = [
  {
    title: "All Events, One Place",
    desc: "No more scrolling through ten different WhatsApp groups to find out what's happening.",
  },
  {
    title: "Simple Registration",
    desc: "Register for any event with one click. Your dashboard keeps track of everything.",
  },
  {
    title: "For Organizers Too",
    desc: "Club coordinators can create events and see who has registered, right from the site.",
  },
];

export default function About() {
  return (
    <section className="section" id="about">
      <div className="container">
        <h2 className="section-title">About the Platform</h2>
        <p className="section-subtitle">
          Campus Events is a small project built to make discovering and joining
          college events a lot less painful.
        </p>

        <div className="about-grid">
          {points.map((p) => (
            <div className="about-card" key={p.title}>
              <h3>{p.title}</h3>
              <p>{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
