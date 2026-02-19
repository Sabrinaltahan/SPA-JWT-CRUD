import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

export default function Navbar() {
  const { isLoggedIn, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  return (
    <div className="navbar">
      <div className="nav-inner">
        <div className="nav-left">
          <span className="pill brand">SPA • JWT • CRUD</span>

          <button
            className="hamburger"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        <div className={`nav-links ${open ? "open" : ""}`}>
          <Link className="pill" to="/" onClick={close}>
            Home
          </Link>
          <Link className="pill" to="/admin" onClick={close}>
            Admin
          </Link>

          {!isLoggedIn ? (
            <Link className="pill" to="/login" onClick={close}>
              Login
            </Link>
          ) : (
            <button
              className="pill btn"
              onClick={() => {
                logout();
                close();
              }}
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </div>
  );
}