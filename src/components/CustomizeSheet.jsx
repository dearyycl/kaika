import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext.jsx";
import { ADDONS, ICE, SUGAR } from "../data/menu.js";
import { rupiah } from "../lib/format.js";
import { CloseIcon, MinusIcon, PlusIcon } from "./Icons.jsx";
import ProductArt from "./ProductArt.jsx";

function Seg({ label, options, value, onChange }) {
  return (
    <div className="field">
      <h4>{label}</h4>
      <div className="seg" role="radiogroup" aria-label={label}>
        {options.map((o) => (
          <button
            key={o.v}
            type="button"
            role="radio"
            aria-checked={value === o.v}
            className={"seg__opt" + (value === o.v ? " is-on" : "")}
            onClick={() => onChange(o.v)}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function CustomizeSheet({ item, onClose }) {
  const { addLine } = useCart();
  const opts = item.options;
  const [ice, setIce] = useState(opts.ice ? ICE[0].v : null);
  const [sugar, setSugar] = useState(opts.sugar ? SUGAR[0].v : null);
  const [addons, setAddons] = useState([]);
  const [note, setNote] = useState("");
  const [qty, setQty] = useState(1);

  const extras = ADDONS.filter((a) => opts.addons.includes(a.id));
  const unit =
    item.price + extras.filter((a) => addons.includes(a.id)).reduce((n, a) => n + a.price, 0);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const toggle = (id) =>
    setAddons((a) => (a.includes(id) ? a.filter((x) => x !== id) : [...a, id]));

  const submit = () => {
    addLine(item, { ice, sugar, addons, note }, qty);
    onClose();
  };

  return (
    <div className="backdrop" onClick={onClose}>
      <div
        className="sheet"
        role="dialog"
        aria-modal="true"
        aria-label={`Racik ${item.name}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sheet__handle" aria-hidden="true" />
        <div className="sheet__media">
          <ProductArt category={item.category} name={item.name} src={item.image} />
          <button type="button" className="sheet__close" aria-label="Tutup" onClick={onClose}>
            <CloseIcon width={20} height={20} />
          </button>
        </div>

        <div className="sheet__body">
          <div className="sheet__title">
            <h3>{item.name}</h3>
            <span>{rupiah(item.price)}</span>
          </div>
          <p className="muted">{item.description}</p>

          {opts.ice && <Seg label="Es batu" options={ICE} value={ice} onChange={setIce} />}
          {opts.sugar && <Seg label="Tingkat gula" options={SUGAR} value={sugar} onChange={setSugar} />}

          {extras.length > 0 && (
            <div className="field">
              <h4>Tambahan</h4>
              <div className="checks">
                {extras.map((a) => (
                  <label key={a.id} className={"check" + (addons.includes(a.id) ? " is-on" : "")}>
                    <input
                      type="checkbox"
                      checked={addons.includes(a.id)}
                      onChange={() => toggle(a.id)}
                    />
                    <span>{a.name}</span>
                    <span className="check__price">+{rupiah(a.price)}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="field">
            <h4>
              Catatan khusus <span className="muted">(opsional)</span>
            </h4>
            <textarea
              rows={3}
              placeholder="Contoh: Tidak pakai es"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          <div className="field field--row">
            <h4>Jumlah</h4>
            <div className="stepper">
              <button type="button" aria-label="Kurangi" onClick={() => setQty((q) => Math.max(1, q - 1))}>
                <MinusIcon width={18} height={18} />
              </button>
              <span aria-live="polite">{qty}</span>
              <button type="button" className="is-plus" aria-label="Tambah" onClick={() => setQty((q) => q + 1)}>
                <PlusIcon width={18} height={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="sheet__foot">
          <button type="button" className="btn-primary" onClick={submit}>
            Tambah ke Keranjang · {rupiah(unit * qty)}
          </button>
        </div>
      </div>
    </div>
  );
}
