import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { CupIcon, ScanIcon } from "../components/Icons.jsx";
import { HeroArt } from "../components/ProductArt.jsx";
import Stars from "../components/Stars.jsx";

// Data rating dari Google Maps (diisi manual dari screenshot)
const RATING = {
  place: "Kaika Space x The Midday",
  score: 4.7,
  reviews: 60,
  url: "https://www.google.com/maps/search/?api=1&query=Kaika+Space+x+The+Midday",
};

export default function Welcome() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { setTable } = useCart();

  // QR di meja berisi URL seperti https://kaika.space/?meja=04
  useEffect(() => {
    const meja = params.get("meja");
    if (meja) setTable(meja.padStart(2, "0"));
  }, [params, setTable]);

  return (
    <main className="welcome">
      <div className="welcome__side">
        <header className="welcome__brand">
          <img
            className="welcome__logo"
            src="/images/logo.png"
            alt="Kaika Space, Coffee - Eatery & Co-working"
          />
        </header>

        <section className="welcome__text">
          <p className="eyebrow">DUDUK NYAMAN. PESAN MUDAH.</p>
          <h2>Selamat Datang di Kaika Space! Silakan pesan langsung dari meja Anda.</h2>
        </section>

        <a className="rating" href={RATING.url} target="_blank" rel="noopener noreferrer">
          <span className="rating__name">{RATING.place}</span>
          <span className="rating__row">
            <b>{String(RATING.score).replace(".", ",")}</b>
            <Stars value={RATING.score} size={17} />
            <span className="rating__count">{RATING.reviews} ulasan Google</span>
          </span>
        </a>

        <footer className="welcome__cta">
          <button type="button" className="btn-primary" onClick={() => navigate("/menu")}>
            <ScanIcon width={22} height={22} />
            Mulai Pesan 
          </button>
          <p className="muted">Scan QR di meja, pilih favorit, kami antar.</p>
        </footer>
      </div>

      <div className="welcome__hero">
        <HeroArt src="/images/hero.jpg" />
        <span className="welcome__chip">
          <CupIcon width={18} height={18} />
          Jeda kecil, cerita baru.
        </span>
      </div>
    </main>
  );
}
