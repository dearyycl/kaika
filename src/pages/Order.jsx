import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useOrders } from "../context/OrderContext.jsx";
import { describeLine, formatTime, PAY_LABEL, rupiah, TAX_RATE } from "../lib/format.js";
import {
  ArrowLeftIcon,
  CheckIcon,
  ChefIcon,
  ClockIcon,
  CupIcon,
  PinIcon,
  PlusIcon,
  ReceiptIcon,
} from "../components/Icons.jsx";

const HERO = {
  baru: {
    title: "Pesanan diterima",
    text: "Terima kasih! Pesanan Anda sudah masuk ke dapur.",
  },
  diproses: {
    title: "Sedang diracik untuk Anda",
    text: "Nikmati waktu santai Anda. Kami akan mengantar pesanan ke meja.",
  },
  selesai: {
    title: "Pesanan sudah siap",
    text: "Selamat menikmati! Terima kasih sudah memesan di Kaika Space.",
  },
};

// Kode QR contoh (bukan QRIS asli) supaya alur pembayaran terlihat di demo
function FakeQR({ seed }) {
  const n = 21;
  let h = 0;
  for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const rnd = () => {
    h = (h * 1664525 + 1013904223) >>> 0;
    return h / 4294967296;
  };
  const inFinder = (x, y) => (x < 8 && y < 8) || (x >= n - 8 && y < 8) || (x < 8 && y >= n - 8);
  const cells = [];
  for (let y = 0; y < n; y++)
    for (let x = 0; x < n; x++)
      if (!inFinder(x, y) && rnd() > 0.5) cells.push(<rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" />);
  const finder = (x, y) => (
    <g transform={`translate(${x} ${y})`}>
      <rect width="7" height="7" />
      <rect x="1" y="1" width="5" height="5" fill="#fff" />
      <rect x="2" y="2" width="3" height="3" />
    </g>
  );
  return (
    <svg className="qr" viewBox="0 0 21 21" shapeRendering="crispEdges" role="img" aria-label="Contoh kode QR">
      <rect width="21" height="21" fill="#fff" />
      <g fill="#232323">
        {cells}
        {finder(0, 0)}
        {finder(14, 0)}
        {finder(0, 14)}
      </g>
    </svg>
  );
}

function Step({ state, icon, title, detail }) {
  return (
    <li className={`step is-${state}`}>
      <span className="step__dot">{icon}</span>
      <div>
        <h4>{title}</h4>
        <p className="muted sm">{detail}</p>
      </div>
    </li>
  );
}

export default function Order() {
  const { id } = useParams();
  const { getOrder, lastId, markPaid } = useOrders();
  const [receipt, setReceipt] = useState(false);
  const order = getOrder(id ?? lastId);

  if (!order) {
    return (
      <main className="page container">
        <header className="pagebar">
          <Link to="/menu" className="icon-btn" aria-label="Kembali ke menu">
            <ArrowLeftIcon width={22} height={22} />
          </Link>
          <div className="pagebar__title">
            <h1>Status Pesanan</h1>
          </div>
        </header>
        <div className="empty">
          <p>Belum ada pesanan.</p>
          <Link to="/menu" className="btn-primary btn-primary--auto">
            Mulai pesan
          </Link>
        </div>
      </main>
    );
  }

  const s = order.status;
  const items = order.lines.reduce((n, l) => n + l.qty, 0);
  const hero = HERO[s];
  const step2 = s === "baru" ? "pending" : s === "diproses" ? "active" : "done";
  const step3 = s === "selesai" ? "done" : "pending";

  return (
    <main className="page container">
      <header className="pagebar">
        <Link to="/menu" className="icon-btn" aria-label="Kembali ke menu">
          <ArrowLeftIcon width={22} height={22} />
        </Link>
        <div className="pagebar__title">
          <h1>Status Pesanan</h1>
          <p className="muted sm">
            #{order.id} · Hari ini, {formatTime(order.createdAt)}
          </p>
        </div>
      </header>

      <div className="split">
        <section className="split__main">
          <div className={`status-hero is-${s}`}>
            <span className="status-hero__icon">
              {s === "selesai" ? <CheckIcon width={28} height={28} /> : <ChefIcon width={28} height={28} />}
            </span>
            <h2>{hero.title}</h2>
            <p>{hero.text}</p>
            <div className="status-hero__meta">
              <span>
                <PinIcon width={16} height={16} /> Meja {order.table}
              </span>
              {s !== "selesai" && (
                <span>
                  <ClockIcon width={16} height={16} /> 10–15 menit
                </span>
              )}
            </div>
          </div>

          {order.payment === "qris" && !order.paid && (
            <div className="card qris">
              <h3>Bayar dengan QRIS</h3>
              <FakeQR seed={order.id} />
              <p className="muted sm center">
                Kode contoh (simulasi). Nanti diganti QRIS dari payment gateway.
              </p>
              <strong className="qris__total">{rupiah(order.total)}</strong>
              <button type="button" className="btn-soft" onClick={() => markPaid(order.id)}>
                Simulasikan pembayaran berhasil
              </button>
            </div>
          )}

          <div className="card">
            <div className="card__head">
              <h3>Perjalanan pesanan</h3>
              <span className="live">Live</span>
            </div>
            <ol className="timeline">
              <Step
                state="done"
                icon={<CheckIcon width={18} height={18} />}
                title="Pesanan Diterima"
                detail={`${formatTime(order.createdAt)} · ${
                  order.paid ? `Pembayaran ${PAY_LABEL[order.payment]} berhasil` : "Menunggu pembayaran"
                }`}
              />
              <Step
                state={step2}
                icon={<CupIcon width={18} height={18} />}
                title="Sedang Disiapkan di Dapur"
                detail={
                  order.processedAt
                    ? `${formatTime(order.processedAt)} · Barista & dapur sedang menyiapkan`
                    : "Barista & dapur akan segera menyiapkan"
                }
              />
              <Step
                state={step3}
                icon={<CheckIcon width={18} height={18} />}
                title="Siap Diantar / Selesai"
                detail={
                  order.doneAt
                    ? `${formatTime(order.doneAt)} · Sudah diantar ke Meja ${order.table}`
                    : `Kami antar langsung ke Meja ${order.table}`
                }
              />
            </ol>
          </div>
        </section>

        <aside className="split__side">
          <div className="card">
            <div className="total-row">
              <div>
                <p className="muted sm">{items} item · Total pembayaran</p>
                <strong className="total-row__amount">{rupiah(order.total)}</strong>
              </div>
              <span className={"badge" + (order.paid ? " badge--ok" : "")}>
                {order.paid ? `Lunas · ${PAY_LABEL[order.payment]}` : "Belum dibayar"}
              </span>
            </div>

            <button type="button" className="link-btn link-btn--center" onClick={() => setReceipt((r) => !r)}>
              <ReceiptIcon width={18} height={18} /> {receipt ? "Tutup struk" : "Lihat struk pesanan"}
            </button>

            {receipt && (
              <div className="receipt">
                <ul>
                  {order.lines.map((l) => (
                    <li key={l.key}>
                      <span>
                        {l.qty}× {l.name}
                        {describeLine(l) && <small> {describeLine(l)}</small>}
                      </span>
                      <span>{rupiah(l.unit * l.qty)}</span>
                    </li>
                  ))}
                </ul>
                <div className="receipt__row">
                  <span>Subtotal</span>
                  <span>{rupiah(order.subtotal)}</span>
                </div>
                <div className="receipt__row">
                  <span>Pajak &amp; layanan ({TAX_RATE * 100}%)</span>
                  <span>{rupiah(order.tax)}</span>
                </div>
                <div className="receipt__row receipt__row--total">
                  <span>Total</span>
                  <span>{rupiah(order.total)}</span>
                </div>
              </div>
            )}
          </div>

          <Link to="/menu" className="btn-primary">
            <PlusIcon width={20} height={20} /> Pesan Lagi
          </Link>
        </aside>
      </div>
    </main>
  );
}
