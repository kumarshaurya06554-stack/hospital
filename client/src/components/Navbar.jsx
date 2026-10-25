import { Link } from "react-router-dom";
import { HeartPulse, Menu } from "lucide-react";

export default function Navbar() {
  return (
    <header className="navbar">
      <Link to="/" className="brand">
        <span className="brand-icon"><HeartPulse size={25} /></span>
        <span><strong>MedKhoj AI</strong><small>SMARTER MEDICINE DISCOVERY</small></span>
      </Link>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/scanner">AI Scanner</Link>
        <Link to="/pharmacies">Pharmacies</Link>
        <Link to="/prices">Compare Prices</Link>
      </nav>
      <Link className="nav-button" to="/scanner">Find Medicine ?</Link>
      <button className="mobile-menu" aria-label="Menu"><Menu /></button>
    </header>
  );
}
