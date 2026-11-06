import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { ADDONS } from "../data/menu.js";
import { TAX_RATE } from "../lib/format.js";

const CartContext = createContext(null);
const KEY = "kaika.cart.v1";

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) ?? {};
  } catch {
    return {};
  }
}

export function CartProvider({ children }) {
  const [state, setState] = useState(() => {
    const s = load();
    return { table: s.table ?? "04", lines: s.lines ?? [] };
  });

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* abaikan */
    }
  }, [state]);

  const value = useMemo(() => {
    const lines = state.lines;
    const subtotal = lines.reduce((n, l) => n + l.unit * l.qty, 0);
    const tax = Math.round(subtotal * TAX_RATE);

    return {
      table: state.table,
      lines,
      totalItems: lines.reduce((n, l) => n + l.qty, 0),
      subtotal,
      tax,
      total: subtotal + tax,

      setTable: (table) => setState((s) => ({ ...s, table })),

      // cfg: { ice, sugar, addons: [id], note }
      addLine: (item, cfg, qty = 1) =>
        setState((s) => {
          const addonIds = [...(cfg.addons ?? [])].sort();
          const note = (cfg.note ?? "").trim();
          const key = [item.id, cfg.ice ?? "", cfg.sugar ?? "", addonIds.join("+"), note].join("|");
          const extras = ADDONS.filter((a) => addonIds.includes(a.id));
          const unit = item.price + extras.reduce((n, a) => n + a.price, 0);
          const found = s.lines.find((l) => l.key === key);
          const lines = found
            ? s.lines.map((l) => (l.key === key ? { ...l, qty: l.qty + qty } : l))
            : [
                ...s.lines,
                {
                  key,
                  itemId: item.id,
                  name: item.name,
                  category: item.category,
                  base: item.price,
                  unit,
                  qty,
                  ice: cfg.ice ?? null,
                  sugar: cfg.sugar ?? null,
                  addons: addonIds,
                  note,
                },
              ];
          return { ...s, lines };
        }),

      setQty: (key, qty) =>
        setState((s) => ({
          ...s,
          lines:
            qty <= 0
              ? s.lines.filter((l) => l.key !== key)
              : s.lines.map((l) => (l.key === key ? { ...l, qty } : l)),
        })),

      removeLine: (key) =>
        setState((s) => ({ ...s, lines: s.lines.filter((l) => l.key !== key) })),

      clear: () => setState((s) => ({ ...s, lines: [] })),
    };
  }, [state]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart harus dipakai di dalam <CartProvider>");
  return ctx;
}
