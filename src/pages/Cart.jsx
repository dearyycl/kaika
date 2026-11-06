import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useOrders } from "../context/OrderContext.jsx";
import { describeLine, rupiah, TAX_RATE } from "../lib/format.js";
import ProductArt from "../components/ProductArt.jsx";
import {
  ArrowLeftIcon,
  CardIcon,
  CashIcon,
  MinusIcon,
  PlusIcon,
  QrIcon,
  TrashIcon,
} from "../components/Icons.jsx";

const METHODS = [
  { id: "qris", label: "QRIS (Dompet Digital)", Icon: QrIcon, note: "Kode QRIS muncul setelah pesanan dikonfirmasi." },
  { id: "debit", label: "Kartu Debit", Icon: CardIcon, note: "Pembayaran debit dilakukan di kasir." },
  { id: "kasir", label: "Bayar di Kasir (Tunai)", Icon: CashIcon, note: "Silakan bayar di kasir setelah memesan." },
];

export default function Cart() {
  const navigate = useNavigate();
  const { table, lines, totalItems, subtotal, tax, total, setQty, removeLine, clear } = useCart();
  const { placeOrder } = useOrders();
  const [edit, setEdit] = useState(false);
  const [payment, setPayment] = useState("qris");

  const confirm = () => {
    const order = placeOrder({ table, lines, subtotal, tax, total, payment });
    clear();
    navigate(`/status/${order.id}`, { replace: true });
  };

  return (
    <main className={"page container" + (lines.length > 0 ? " page--cart" : "")}>
      <header className="pagebar">
        <Link to="/menu" className="icon-btn" aria-label="Kembali ke menu">
          <ArrowLeftIcon width={22} height={22} />
        </Link>
        <div className="pagebar__title">
          <h1>Keranjang Anda</h1>
          <p className="muted sm">
            {totalItems} item · Meja {table}
          </p>
        </div>
        {lines.length > 0 && (
          <button type="button" className="link-btn" onClick={() => setEdit((e) => !e)}>
            {edit ? "Selesai" : "Edit"}
          </button>
        )}
      </header>

      {lines.length === 0 ? (
        <div className="empty">
          <p>Keranjang masih kosong.</p>
          <Link to="/menu" className="btn-primary btn-primary--auto">
            Lihat menu
          </Link>
        </div>
      ) : (
        <div className="split">
          <section className="split__main">
            <ul className="lines">
              {lines.map((l) => (
                <li key={l.key} className="line">
                  <ProductArt className="line__img" category={l.category} name={l.name} />
                  <div className="line__body">
                    <h3>{l.name}</h3>
                    {describeLine(l) && <p className="muted sm">{describeLine(l)}</p>}
                    {l.note && <p className="muted sm">“{l.note}”</p>}
                    <p className="muted sm">{rupiah(l.unit)} / item</p>
                  </div>
                  <div className="line__side">
                    <strong>{rupiah(l.unit * l.qty)}</strong>
                    {edit ? (
                      <button type="button" className="link-btn link-btn--danger" onClick={() => removeLine(l.key)}>
                        <TrashIcon width={16} height={16} /> Hapus
                      </button>
                    ) : (
                      <div className="stepper stepper--sm">
                        <button type="button" aria-label={`Kurangi ${l.name}`} onClick={() => setQty(l.key, l.qty - 1)}>
                          <MinusIcon width={14} height={14} />
                        </button>
                        <span>{l.qty}</span>
                        <button type="button" className="is-plus" aria-label={`Tambah ${l.name}`} onClick={() => setQty(l.key, l.qty + 1)}>
                          <PlusIcon width={14} height={14} />
                        </button>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>

            <div className="more">
              <span className="muted">Masih ingin yang lain?</span>
              <Link to="/menu" className="link-btn">
                + Tambah menu
              </Link>
            </div>
          </section>

          <aside className="split__side">
            <div className="card">
              <h3>Ringkasan pembayaran</h3>
              <dl className="sum">
                <div>
                  <dt>Subtotal</dt>
                  <dd>{rupiah(subtotal)}</dd>
                </div>
                <div>
                  <dt>Pajak &amp; layanan ({TAX_RATE * 100}%)</dt>
                  <dd>{rupiah(tax)}</dd>
                </div>
                <div className="sum__total">
                  <dt>Total pembayaran</dt>
                  <dd>{rupiah(total)}</dd>
                </div>
              </dl>
            </div>

            <div className="card">
              <h3>Metode pembayaran</h3>
              <div className="methods" role="radiogroup" aria-label="Metode pembayaran">
                {METHODS.map(({ id, label, Icon }) => (
                  <button
                    key={id}
                    type="button"
                    role="radio"
                    aria-checked={payment === id}
                    className={"method" + (payment === id ? " is-on" : "")}
                    onClick={() => setPayment(id)}
                  >
                    <Icon width={20} height={20} />
                    <span>{label}</span>
                    <i className="method__radio" />
                  </button>
                ))}
              </div>
            </div>

            <div className="checkout">
              <p className="muted sm center">{METHODS.find((m) => m.id === payment).note}</p>
              <button type="button" className="btn-primary" onClick={confirm}>
                Konfirmasi &amp; Pesan Sekarang
              </button>
            </div>
          </aside>
        </div>
      )}
    </main>
  );
}
