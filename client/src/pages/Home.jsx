import { Link } from "react-router-dom";
import {
  ScanLine, MapPin, Tags, PackageCheck, ClipboardList,
  Siren, Truck, Calculator, CalendarClock, ArrowUpRight
} from "lucide-react";

const features = [
  { icon: ScanLine, title: "AI Medicine Scanner", desc: "Read medicine packaging with AI assistance.", path: "/scanner", color: "purple" },
  { icon: MapPin, title: "Nearby Pharmacies", desc: "Explore pharmacies around your location.", path: "/pharmacies", color: "blue" },
  { icon: Tags, title: "Smart Price Comparison", desc: "Compare prices of equivalent medicine packs.", path: "/prices", color: "orange" },
  { icon: PackageCheck, title: "Verified Stock", desc: "View stock status and its last confirmation.", path: "/stock", color: "green" },
  { icon: ClipboardList, title: "Medicine Mission Mode", desc: "Review a complete prescription checklist.", path: "/mission", color: "pink" },
  { icon: Siren, title: "Emergency Medicine Radar", desc: "Find pharmacies with recently confirmed stock.", path: "/emergency", color: "red" },
  { icon: Truck, title: "Order & Delivery", desc: "Submit and track an order request.", path: "/orders", color: "cyan" },
  { icon: Calculator, title: "Total Cost Calculator", desc: "Estimate medicine and delivery costs.", path: "/calculator", color: "yellow" },
  { icon: CalendarClock, title: "Expiry Checker", desc: "Check manufacturing and expiry dates.", path: "/expiry", color: "teal" }
];

export default function Home() {
  return (
    <main className="page">
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">? SMARTER MEDICINE DISCOVERY</span>
          <h1>Your health journey,<br /><span>made simpler.</span></h1>
          <p>Find medicines, compare prices and explore pharmacy availability — all in one place.</p>
          <div className="actions">
            <Link className="primary" to="/scanner">Scan Medicine <ArrowUpRight size={18} /></Link>
            <Link className="secondary" to="/pharmacies">Explore Pharmacies</Link>
          </div>
          <p className="safety">? AI-assisted information. Always verify medicine details with a pharmacist.</p>
        </div>
        <div className="hero-art">
          <div className="glow"></div>
          <div className="medicine-box">
            <span className="cross">+</span>
            <strong>MEDKHOJ</strong>
            <small>Care starts here.</small>
            <div className="pills"><i></i><i></i><i></i></div>
          </div>
          <div className="float-card">? Safety comes first</div>
        </div>
      </section>

      <section className="features">
        <div className="section-heading">
          <div><span className="eyebrow">YOUR HEALTH TOOLKIT</span><h2>Everything in one place.</h2><p>Explore the tools designed to simplify medicine discovery.</p></div>
          <span className="count">09 FEATURES</span>
        </div>
        <div className="feature-grid">
          {features.map(({ icon: Icon, title, desc, path, color }) => (
            <Link to={path} className="feature-card" key={title}>
              <div className={`feature-icon ${color}`}><Icon size={23} /></div>
              <ArrowUpRight className="arrow" size={19} />
              <h3>{title}</h3><p>{desc}</p>
              <span className="explore">Explore feature ?</span>
            </Link>
          ))}
        </div>
        <p className="notice">Demo notice: pharmacy prices and stock are sample data unless confirmed by a participating pharmacy.</p>
      </section>
    </main>
  );
}
