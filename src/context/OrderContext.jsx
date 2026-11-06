import { createContext, useContext, useEffect, useMemo, useState } from "react";

// Sementara pesanan disimpan di localStorage supaya tab pelanggan dan tab staf
// (/staff) bisa saling sinkron di browser yang sama. Nanti diganti API Laravel.
const OrderContext = createContext(null);
const KEY = "kaika.orders.v1";
const LAST = "kaika.lastOrder.v1";

const seed = () => [
  {
    id: "KK-025",
    table: "07",
    lines: [
      {
        key: "seed-1",
        name: "Iced Matcha Latte",
        qty: 1,
        unit: 32000,
        ice: "Normal Ice",
        sugar: "Normal Sugar",
        addons: [],
        note: "",
      },
    ],
    subtotal: 32000,
    tax: 3200,
    total: 35200,
    payment: "kasir",
    paid: false,
    status: "baru",
    createdAt: new Date(Date.now() - 4 * 60000).toISOString(),
  },
];

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* abaikan */
  }
  return seed();
}

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState(read);
  const [lastId, setLastId] = useState(() => {
    try {
      return localStorage.getItem(LAST);
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(orders));
    } catch {
      /* abaikan */
    }
  }, [orders]);

  // sinkron antar tab
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === KEY) setOrders(read());
      if (e.key === LAST) setLastId(e.newValue);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const value = useMemo(() => {
    const patch = (id, fn) =>
      setOrders((prev) => prev.map((o) => (o.id === id ? fn(o) : o)));

    return {
      orders,
      lastId,
      getOrder: (id) => orders.find((o) => o.id === id) ?? null,

      placeOrder: (data) => {
        const n =
          orders.reduce((m, o) => Math.max(m, parseInt(o.id.slice(3), 10) || 0), 24) + 1;
        const order = {
          ...data,
          id: `KK-${String(n).padStart(3, "0")}`,
          paid: false,
          status: "baru",
          createdAt: new Date().toISOString(),
        };
        setOrders((prev) => [order, ...prev]);
        setLastId(order.id);
        try {
          localStorage.setItem(LAST, order.id);
        } catch {
          /* abaikan */
        }
        return order;
      },

      setStatus: (id, status) =>
        patch(id, (o) => ({
          ...o,
          status,
          paid: status === "selesai" ? true : o.paid,
          processedAt: status === "diproses" ? new Date().toISOString() : o.processedAt,
          doneAt: status === "selesai" ? new Date().toISOString() : o.doneAt,
        })),

      markPaid: (id) => patch(id, (o) => ({ ...o, paid: true })),
    };
  }, [orders, lastId]);

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

export function useOrders() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrders harus dipakai di dalam <OrderProvider>");
  return ctx;
}
