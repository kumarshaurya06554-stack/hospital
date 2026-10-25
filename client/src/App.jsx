import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowDown, ArrowRight, Check, HeartPulse, PackageSearch, Search,
  ShieldCheck, Sparkles, X
} from "lucide-react";
import MedicineAssistant from "./components/MedicineAssistant";
import { getMedicines } from "./services/medicineService";
import "./App.css";

const formatPrice = (price) => {
  const amount = Number(price);
  return Number.isFinite(amount)
    ? new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amount)
    : "Price unavailable";
};

export default function App() {
  const [medicines, setMedicines] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadMedicines = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getMedicines();
      setMedicines(data.medicines);
    } catch (connectionError) {
      console.error("Unable to load the medicine catalogue:", connectionError);
      setError(connectionError.message || "Unable to connect to the medicine catalogue.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMedicines();
  }, [loadMedicines]);

  const filteredMedicines = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    const matches = medicines.filter((medicine) =>
      [medicine.name, medicine.strength, medicine.pack_size]
        .filter(Boolean)
        .some((value) => String(value).toLocaleLowerCase().includes(query))
    );

    return matches.sort((first, second) => {
      if (sortBy === "price") {
        return Number(first.price) - Number(second.price);
      }
      return first.name.localeCompare(second.name);
    });
  }, [medicines, search, sortBy]);

  const lowestPrice = medicines.reduce((lowest, medicine) => {
    const price = Number(medicine.price);
    return Number.isFinite(price) && price >= 0 ? Math.min(lowest, price) : lowest;
  }, Number.POSITIVE_INFINITY);

  return (
    <div className="site-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="MedKhoj AI home">
          <span className="brand-mark"><HeartPulse size={21} strokeWidth={2.5} /></span>
          <span className="brand-name">medkhoj<span>.</span></span>
        </a>

        <nav className="main-nav" aria-label="Main navigation">
          <a className="nav-link active" href="#top">Home</a>
          <a className="nav-link" href="#catalogue">Medicine catalogue</a>
          <a className="nav-link" href="#about">About</a>
        </nav>

        <div className={`connection-status ${error ? "offline" : loading ? "connecting" : "online"}`} role="status">
          <span className="connection-dot" />
          {error ? "Connection issue" : loading ? "Connecting" : "Catalogue live"}
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-copy">
            <div className="hero-kicker"><Sparkles size={14} /> MEDICINE DISCOVERY, MADE SIMPLE</div>
            <h1>Find the right medicine.<br /><span>Feel more in control.</span></h1>
            <p className="hero-description">
              Browse clear medicine details and sample prices from one helpful catalogue.
              Search by name, strength, or pack size.
            </p>

            <form className="hero-search" onSubmit={(event) => {
              event.preventDefault();
              document.getElementById("catalogue")?.scrollIntoView({ behavior: "smooth" });
            }}>
              <Search className="search-icon" size={20} aria-hidden="true" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Try “Paracetamol” or “500 mg”"
                aria-label="Search medicines by name, strength, or pack size"
              />
              {search && (
                <button className="clear-search" type="button" onClick={() => setSearch("")} aria-label="Clear search">
                  <X size={17} />
                </button>
              )}
              <button className="search-submit" type="submit" aria-label="View matching medicines">
                <ArrowRight size={19} />
              </button>
            </form>

            <div className="trust-note"><ShieldCheck size={16} /> Helpful information. Always confirm with a pharmacist.</div>
          </div>

          <div className="hero-visual" aria-hidden="true">
            <div className="visual-orbit orbit-back" />
            <div className="visual-orbit orbit-front" />
            <div className="visual-glow" />
            <div className="medical-cross">+</div>
            <div className="capsule capsule-large"><span /></div>
            <div className="capsule capsule-small"><span /></div>
            <div className="visual-card">
              <span className="visual-card-icon"><PackageSearch size={18} /></span>
              <span><strong>Care starts with clarity</strong><small>Explore your options</small></span>
              <Check size={17} className="visual-check" />
            </div>
            <span className="visual-spark spark-one">✳</span>
            <span className="visual-spark spark-two">✦</span>
          </div>

          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-value">{loading ? "—" : medicines.length}</span>
              <span className="stat-label">catalogue items</span>
            </div>
            <span className="stat-divider" />
            <div className="stat-item">
              <span className="stat-value">{Number.isFinite(lowestPrice) ? formatPrice(lowestPrice) : "—"}</span>
              <span className="stat-label">lowest listed price</span>
            </div>
            <div className="stat-caption">Sample catalogue data</div>
          </div>
        </section>

        <section className="catalogue-section" id="catalogue">
          <div className="catalogue-heading">
            <div>
              <div className="section-kicker">YOUR CATALOGUE</div>
              <h2>A little more clarity.</h2>
              <p>Browse medicine details and compare listed sample prices.</p>
            </div>
            <label className="sort-control">
              <span>Sort by</span>
              <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} aria-label="Sort medicines">
                <option value="name">Name</option>
                <option value="price">Price: low to high</option>
              </select>
              <ArrowDown size={15} aria-hidden="true" />
            </label>
          </div>

          <div className="results-line">
            <span>{loading ? "Loading catalogue…" : `${filteredMedicines.length} ${filteredMedicines.length === 1 ? "medicine" : "medicines"} found`}</span>
            {search && <button className="search-filter" onClick={() => setSearch("")}>“{search}” <X size={14} /></button>}
          </div>

          {loading && (
            <div className="medicine-grid" aria-label="Loading medicines" aria-busy="true">
              {[1, 2, 3].map((item) => <div className="skeleton-card" key={item}><span /><span /><span /><span /></div>)}
            </div>
          )}

          {!loading && error && (
            <div className="feedback-panel error-panel" role="alert">
              <div className="feedback-icon"><PackageSearch size={23} /></div>
              <h3>We couldn’t reach the catalogue</h3>
              <p>{error} Make sure the backend is running, then try again.</p>
              <button className="retry-button" onClick={loadMedicines}>Try again <ArrowRight size={16} /></button>
            </div>
          )}

          {!loading && !error && filteredMedicines.length === 0 && (
            <div className="feedback-panel empty-panel">
              <div className="feedback-icon"><Search size={22} /></div>
              <h3>No matches just yet</h3>
              <p>Try a different medicine name, strength, or pack size.</p>
              {search && <button className="retry-button" onClick={() => setSearch("")}>Show all medicines <ArrowRight size={16} /></button>}
            </div>
          )}

          {!loading && !error && filteredMedicines.length > 0 && (
            <div className="medicine-grid">
              {filteredMedicines.map((medicine, index) => (
                <article className="medicine-card" key={medicine.id}>
                  <div className={`medicine-card-top card-tone-${index % 4}`}>
                    <span className="medicine-symbol">{["✚", "◈", "✿", "＋"][index % 4]}</span>
                    <span className="sample-tag">SAMPLE LISTING</span>
                  </div>
                  <div className="medicine-card-body">
                    <p className="medicine-category">MEDICINE</p>
                    <h3>{medicine.name}</h3>
                    <p className="medicine-strength">{medicine.strength || "Strength not listed"}</p>
                    <div className="pack-row">
                      <span>Pack size</span>
                      <strong>{medicine.pack_size || "Not listed"}</strong>
                    </div>
                    <div className="medicine-price-row">
                      <div><span>Listed sample price</span><strong>{formatPrice(medicine.price)}</strong></div>
                      <span className="price-arrow" aria-hidden="true"><ArrowRight size={18} /></span>
                    </div>
                    {Number(medicine.demo_data) === 1 && (
                      <p className="demo-disclaimer"><ShieldCheck size={13} /> Not a live pharmacy quote</p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <MedicineAssistant />

        <section className="safety-banner" id="about">
          <div className="safety-icon"><ShieldCheck size={22} /></div>
          <div><strong>Your wellbeing comes first.</strong><p>Prices and availability are sample data. Confirm medicine information and suitability with a qualified pharmacist.</p></div>
          <span className="safety-decoration" aria-hidden="true">+</span>
        </section>
      </main>

      <footer className="site-footer">
        <a className="brand footer-brand" href="#top">
          <span className="brand-mark"><HeartPulse size={18} strokeWidth={2.5} /></span>
          <span className="brand-name">medkhoj<span>.</span></span>
        </a>
        <p>Thoughtful tools for a clearer medicine search.</p>
        <span className="footer-copyright">© 2026 MedKhoj AI</span>
      </footer>
    </div>
  );
}
