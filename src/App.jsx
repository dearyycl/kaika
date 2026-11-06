import { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Welcome from "./pages/Welcome.jsx";
import Menu from "./pages/Menu.jsx";
import Cart from "./pages/Cart.jsx";
import Order from "./pages/Order.jsx";
import Staff from "./pages/Staff.jsx";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* QR di meja mengarah ke: /?meja=04 */}
        <Route path="/" element={<Welcome />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/status" element={<Order />} />
        <Route path="/status/:id" element={<Order />} />
        <Route path="/staff" element={<Staff />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
