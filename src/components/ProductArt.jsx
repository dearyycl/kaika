import { useId, useState } from "react";

// Gambar default sementara untuk menu (SVG). Kalau item.image diisi dan filenya
// ada, foto otomatis tampil menimpa gambar default ini.

const PALETTE = {
  "Coffee Base": ["#dcb98f", "#8a5a3b"],
  "Manual Brew": ["#e6cfa8", "#a47148"],
  "Creamy Coffee": ["#efdcc2", "#b98a62"],
  "Signature Coffee": ["#eab99b", "#9b4a3a"],
  "Tea Base": ["#f2c9b8", "#b4586a"],
  "Matcha Base": ["#d2e2ab", "#6d8f4a"],
  "Non Coffee": ["#e8cfbb", "#8c5b6b"],
};

const ICED = /\b(iced|ice)\b|on the rock|cold/i;

function Glass() {
  return (
    <g transform="translate(80 84)">
      <path d="M-24 -40H24L19 44Q18.5 50 12 50H-12Q-18.5 50 -19 44Z" fill="#fff" opacity=".35" />
      <path d="M-22 -12H22L19 44Q18.5 50 12 50H-12Q-18.5 50 -19 44Z" fill="#3b1f14" opacity=".85" />
      <rect x="-13" y="-8" width="11" height="11" rx="2.5" fill="#fff" opacity=".55" transform="rotate(-12 -7 -2)" />
      <rect x="3" y="2" width="11" height="11" rx="2.5" fill="#fff" opacity=".5" transform="rotate(10 8 8)" />
      <path d="M8 -52L18 -30" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
    </g>
  );
}

function Cup() {
  return (
    <g transform="translate(78 92)">
      <path d="M-30 -14H26V10Q26 34 2 34H-6Q-30 34 -30 10Z" fill="#fff" opacity=".92" />
      <path d="M26 -6H34Q44 -6 44 6Q44 18 32 18H25" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" opacity=".92" />
      <rect x="-24" y="-14" width="44" height="6" rx="3" fill="#3b1f14" opacity=".8" />
      <ellipse cx="-2" cy="38" rx="42" ry="6" fill="#fff" opacity=".6" />
      <path d="M-12 -26q-6 -8 0 -16M4 -26q-6 -8 0 -16" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" opacity=".8" />
    </g>
  );
}

export default function ProductArt({ category, name, src, className = "" }) {
  const gid = useId().replace(/:/g, "");
  const [loaded, setLoaded] = useState(false);
  const [c1, c2] = PALETTE[category] ?? PALETTE["Coffee Base"];

  return (
    <div className={`art ${className}`}>
      <svg viewBox="0 0 160 160" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={c1} />
            <stop offset="1" stopColor={c2} />
          </linearGradient>
        </defs>
        <rect width="160" height="160" fill={`url(#${gid})`} />
        <ellipse cx="80" cy="136" rx="46" ry="8" fill="#000" opacity=".12" />
        {ICED.test(name) ? <Glass /> : <Cup />}
      </svg>
      {src && (
        <img
          src={src}
          alt={name}
          loading="lazy"
          className={loaded ? "is-on" : ""}
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(false)}
        />
      )}
    </div>
  );
}

// Gambar hero halaman awal. Taruh foto di public/images/hero.jpg untuk menggantinya.
export function HeroArt({ src }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="art art--hero">
      <svg viewBox="0 0 320 420" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <linearGradient id="hero-wall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ecd9bd" />
            <stop offset="1" stopColor="#c99d70" />
          </linearGradient>
          <linearGradient id="hero-window" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#dff0cf" />
            <stop offset="1" stopColor="#7fae6a" />
          </linearGradient>
        </defs>
        <rect width="320" height="420" fill="url(#hero-wall)" />
        <rect y="0" width="320" height="26" fill="#6b4328" opacity=".75" />
        <path d="M70 280V150a60 60 0 0 1 120 0v130Z" fill="#8a5a3b" />
        <path d="M80 280V152a50 50 0 0 1 100 0v128Z" fill="url(#hero-window)" />
        <path d="M95 250q10-50 40-60M150 250q-4-40 20-70M110 200q25 5 40-20" stroke="#4d7a3f" strokeWidth="9" strokeLinecap="round" fill="none" opacity=".75" />
        <path d="M200 120h90v110h-90Z" fill="#7a4a2d" opacity=".55" />
        <path d="M208 138h74M208 168h74M208 198h74" stroke="#e8d3b4" strokeWidth="5" opacity=".7" />
        <ellipse cx="170" cy="384" rx="140" ry="40" fill="#7b4a2c" />
        <ellipse cx="170" cy="372" rx="140" ry="36" fill="#9a6340" />
        <g transform="translate(120 318)">
          <path d="M0 0H44L40 38Q39 46 31 46H13Q5 46 4 38Z" fill="#fff" opacity=".9" />
          <path d="M3 16H41L39 38Q38 44 31 44H13Q6 44 5 38Z" fill="#c9a27a" />
          <path d="M16 -14L34 8" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
        </g>
        <g transform="translate(190 350)">
          <ellipse cx="30" cy="14" rx="40" ry="10" fill="#fff" opacity=".85" />
          <path d="M0 10q30-34 60 0q-30 12-60 0Z" fill="#d9a05a" />
        </g>
      </svg>
      {src && (
        <img
          src={src}
          alt="Suasana Kaika Space"
          className={loaded ? "is-on" : ""}
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(false)}
        />
      )}
    </div>
  );
}
