import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

// variant "top"    -> tampil di header (layar lebar)
// variant "bottom" -> tampil di bawah (HP)
export default function CustomerNav({ variant }) {
  const { table } = useCart();
  const [toast, setToast] = useState(false);
  const timer = useRef();

  useEffect(() => () => clearTimeout(timer.current), []);

  const help = () => {
    setToast(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(false), 3000);
  };

  const cls = ({ isActive }) => "nav-link" + (isActive ? " is-active" : "");

  return (
    <>
      <nav className={`cnav cnav--${variant}`} aria-label="Navigasi">
        <NavLink to="/menu" className={cls}>
          Menu
        </NavLink>
        <NavLink to="/status" className={cls}>
          Pesanan
        </NavLink>
        <button type="button" className="nav-link" onClick={help}>
          Bantuan
        </button>
      </nav>
      {toast && (
        <div className="toast" role="status">
          Staf akan segera menghampiri Meja {table}.
        </div>
      )}
    </>
  );
}
