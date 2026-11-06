import { StarIcon } from "./Icons.jsx";

// Bintang rating gaya Google, mendukung nilai pecahan (mis. 4,7)
export default function Stars({ value = 0, size = 18 }) {
  const pct = (Math.max(0, Math.min(5, value)) / 5) * 100;
  const row = (
    <span className="stars__row">
      {[0, 1, 2, 3, 4].map((i) => (
        <StarIcon key={i} width={size} height={size} />
      ))}
    </span>
  );
  return (
    <span className="stars" role="img" aria-label={`Rating ${value} dari 5`}>
      <span className="stars__base">{row}</span>
      <span className="stars__fill" style={{ width: `${pct}%` }}>
        {row}
      </span>
    </span>
  );
}
