import { ADDONS } from "../data/menu.js";

export const TAX_RATE = 0.1;

export const rupiah = (n) => "Rp" + Math.round(n).toLocaleString("id-ID");

export const formatTime = (iso) =>
  new Date(iso)
    .toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", hour12: false })
    .replace(".", ":");

export const PAY_LABEL = {
  qris: "QRIS",
  debit: "Kartu Debit",
  kasir: "Kasir (Tunai)",
};

export const STATUS_LABEL = {
  baru: "Baru masuk",
  diproses: "Diproses",
  selesai: "Selesai",
};

// "Less Ice · Less Sugar · Oat Milk"
export function describeLine(l) {
  const extras = ADDONS.filter((a) => l.addons?.includes(a.id)).map((a) => a.name);
  return [l.ice, l.sugar, ...extras].filter(Boolean).join(" · ");
}

export function ago(iso, now = Date.now()) {
  const m = Math.floor((now - new Date(iso).getTime()) / 60000);
  return m < 1 ? "baru saja" : `${m} menit lalu`;
}
