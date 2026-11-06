import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { getCategories, getMenus } from "../services/api.js";
import { rupiah } from "../lib/format.js";
import MenuCard from "../components/MenuCard.jsx";
import CustomizeSheet from "../components/CustomizeSheet.jsx";
import CustomerNav from "../components/CustomerNav.jsx";
import { ArrowRightIcon, BagIcon, SearchIcon } from "../components/Icons.jsx";

export default function Menu() {
  const { table, totalItems, subtotal } = useCart();
  const [menus, setMenus] = useState([]);
  const [categories, setCategories] = useState([]);
  const [active, setActive] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    Promise.all([getMenus(), getCategories()])
      .then(([m, c]) => {
        setMenus(m);
        setCategories(c);
        setActive(c[0] ?? "");
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return menus.filter((m) =>
      q ? `${m.name} ${m.description}`.toLowerCase().includes(q) : m.category === active
    );
  }, [menus, active, query]);

  const close = useCallback(() => setSelected(null), []);
  const empty = totalItems === 0;

  return (
    <main className="menu-page container">
      <header className="topbar">
        <Link to="/" className="topbar__logo" aria-label="Kaika Space">
          <img src="/images/logo-mark.png" alt="Kaika Space" />
        </Link>
        <CustomerNav variant="top" />
        <div className="topbar__actions">
          <span className="pill">Meja {table}</span>
          <Link to="/cart" className="cart-btn" aria-label={`Keranjang, ${totalItems} item`}>
            <BagIcon width={26} height={26} />
            <span className="cart-btn__badge">{totalItems}</span>
          </Link>
        </div>
      </header>

      <section className="menu-page__intro">
        <h2>Teman untuk jeda Anda.</h2>
        <p className="muted lg">Kopi, makanan hangat, dan ide-ide baru.</p>
      </section>

      <label className="search">
        <SearchIcon width={22} height={22} />
        <input
          type="search"
          placeholder="Cari menu favorit Anda"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </label>

      <nav className="tabs" aria-label="Kategori menu">
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            className={"tab" + (c === active && !query ? " is-active" : "")}
            onClick={() => {
              setActive(c);
              setQuery("");
            }}
          >
            {c}
          </button>
        ))}
      </nav>

      <div className="section-head">
        <h3>{query ? "Hasil pencarian" : "Pilihan untuk Anda"}</h3>
        <span className="muted">{filtered.length} menu</span>
      </div>

      <section className="menu-list">
        {loading && <p className="muted">Memuat menu…</p>}
        {!loading && filtered.length === 0 && <p className="muted">Menu tidak ditemukan.</p>}
        {filtered.map((item) => (
          <MenuCard key={item.id} item={item} onSelect={setSelected} />
        ))}
      </section>

      <div className="dock">
        <div className="dock__inner">
          <Link
            to="/cart"
            className={"cart-bar" + (empty ? " is-empty" : "")}
            aria-disabled={empty}
            onClick={(e) => empty && e.preventDefault()}
          >
            <span>
              {totalItems} item · {rupiah(subtotal)}
            </span>
            <span className="cart-bar__link">
              Lihat keranjang <ArrowRightIcon width={20} height={20} />
            </span>
          </Link>
          <CustomerNav variant="bottom" />
        </div>
      </div>

      {selected && <CustomizeSheet key={selected.id} item={selected} onClose={close} />}
    </main>
  );
}
