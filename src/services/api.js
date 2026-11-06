import { categories, menus } from "../data/menu.js";

// Ubah ke false saat backend Laravel sudah siap.
const USE_MOCK = true;

async function request(path, options = {}) {
  const res = await fetch(`/api${path}`, {
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error(`Request gagal: ${res.status}`);
  return res.json();
}

// GET /api/menus -> [{ id, category, name, description, price, image, options }]
export async function getMenus() {
  if (USE_MOCK) return menus;
  return request("/menus");
}

// GET /api/categories -> ["Coffee Base", ...]
export async function getCategories() {
  if (USE_MOCK) return categories;
  return request("/categories");
}

// Pesanan saat ini masih disimpan di localStorage (lihat src/context/OrderContext.jsx).
// Saat Laravel siap, ganti isi fungsi di OrderContext dengan:
//   POST  /api/orders              -> buat pesanan
//   GET   /api/orders/{id}         -> status pesanan (polling / websocket)
//   GET   /api/orders              -> daftar pesanan untuk dashboard staf
//   PATCH /api/orders/{id}/status  -> staf ubah status
export { request };
