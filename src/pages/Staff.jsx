import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useOrders } from "../context/OrderContext.jsx";
import { ago, describeLine, formatTime, PAY_LABEL, rupiah, STATUS_LABEL } from "../lib/format.js";
import {
  ArrowRightIcon,
  BellIcon,
  ChartIcon,
  CheckIcon,
  ReceiptIcon,
  TrendIcon,
  UserIcon,
  UtensilsIcon,
} from "../components/Icons.jsx";

function greeting(d) {
  const h = d.getHours();
  if (h < 11) return { hello: "Selamat pagi", shift: "Shift pagi" };
  if (h < 15) return { hello: "Selamat siang", shift: "Shift siang" };
  if (h < 18) return { hello: "Selamat sore", shift: "Shift sore" };
  return { hello: "Selamat malam", shift: "Shift malam" };
}

function OrderCard({ o, now, onNext }) {
  return (
    <article className={"qcard" + (o.status === "diproses" ? " is-active" : "")}>
      <div className="qcard__head">
        <div>
          <h4>Meja {o.table}</h4>
          <p className="muted sm">
            #{o.id} · {formatTime(o.createdAt)} · {ago(o.createdAt, now)}
          </p>
        </div>
        <span className={`status status--${o.status}`}>{STATUS_LABEL[o.status]}</span>
      </div>

      <ul className="qcard__lines">
        {o.lines.map((l) => (
          <li key={l.key}>
            {l.qty}× {l.name}
            {describeLine(l) && <span className="muted sm"> · {describeLine(l)}</span>}
            {l.note && <span className="muted sm"> · “{l.note}”</span>}
          </li>
        ))}
      </ul>

      <div className="qcard__foot">
        <strong>{rupiah(o.total)}</strong>
        <span className="muted sm">
          {o.paid ? "Lunas" : "Belum bayar"} · {PAY_LABEL[o.payment]}
        </span>
      </div>

      {o.status === "baru" && (
        <button type="button" className="btn-soft" onClick={() => onNext(o.id, "diproses")}>
          Proses pesanan <ArrowRightIcon width={18} height={18} />
        </button>
      )}
      {o.status === "diproses" && (
        <button type="button" className="btn-primary btn-primary--sm" onClick={() => onNext(o.id, "selesai")}>
          <CheckIcon width={18} height={18} /> Selesai
        </button>
      )}
    </article>
  );
}

export default function Staff() {
  const { orders, setStatus } = useOrders();
  const [tab, setTab] = useState("aktif");
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(t);
  }, []);

  const today = new Date(now);
  const { hello, shift } = greeting(today);
  const todays = orders.filter((o) => new Date(o.createdAt).toDateString() === today.toDateString());
  const revenue = todays.reduce((n, o) => n + o.total, 0);
  const doneToday = todays.filter((o) => o.status === "selesai").length;

  const byTime = [...orders].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  const groups = {
    aktif: byTime.filter((o) => o.status !== "selesai"),
    diproses: byTime.filter((o) => o.status === "diproses"),
    selesai: byTime.filter((o) => o.status === "selesai").reverse(),
  };
  const newCount = orders.filter((o) => o.status === "baru").length;
  const list = groups[tab];

  const tabs = [
    ["aktif", "Aktif"],
    ["diproses", "Diproses"],
    ["selesai", "Selesai"],
  ];

  return (
    <div className="staff">
      <main className="staff__main">
        <header className="staff__top">
          <img className="staff__logo" src="/images/logo-mark.png" alt="Kaika Space" />
          <Link to="/" className="pill" title="Kembali ke tampilan pelanggan">
            Mode Staf
          </Link>
        </header>

        <section className="staff__greet">
          <div>
            <h1>{hello}, tim!</h1>
            <p className="muted">
              {today.toLocaleDateString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}{" "}
              · {shift}
            </p>
          </div>
          <span className="bell" aria-label={`${newCount} pesanan baru`}>
            <BellIcon width={22} height={22} />
            {newCount > 0 && <i>{newCount}</i>}
          </span>
        </section>

        <section className="revenue">
          <div className="revenue__top">
            <span>Pendapatan hari ini</span>
            <TrendIcon width={20} height={20} />
          </div>
          <strong>{rupiah(revenue)}</strong>
          <p>
            {todays.length} pesanan · {doneToday} selesai
          </p>
        </section>

        <div className="seg seg--tabs" role="tablist">
          {tabs.map(([key, label]) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={tab === key}
              className={"seg__opt" + (tab === key ? " is-on" : "")}
              onClick={() => setTab(key)}
            >
              {label} ({groups[key].length})
            </button>
          ))}
        </div>

        <div className="section-head">
          <h3>Antrean meja</h3>
          <span className="muted sm">
            Diperbarui {today.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", hour12: false }).replace(".", ":")}
          </span>
        </div>

        <div className="queue">
          {list.length === 0 && <p className="muted">Belum ada pesanan di tab ini.</p>}
          {list.map((o) => (
            <OrderCard key={o.id} o={o} now={now} onNext={setStatus} />
          ))}
        </div>
      </main>

      <nav className="staff__nav" aria-label="Navigasi staf">
        <button type="button" className="snav is-active">
          <ReceiptIcon width={22} height={22} />
          <span>Pesanan</span>
        </button>
        <button type="button" className="snav">
          <UtensilsIcon width={22} height={22} />
          <span>Menu</span>
        </button>
        <button type="button" className="snav">
          <ChartIcon width={22} height={22} />
          <span>Laporan</span>
        </button>
        <button type="button" className="snav">
          <UserIcon width={22} height={22} />
          <span>Akun</span>
        </button>
      </nav>
    </div>
  );
}
