// frontend/app/src/components/NavBar.jsx
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

export default function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const rawUser = localStorage.getItem("user");
  const isAuthenticated = !!rawUser;

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

  function logout() {
    localStorage.removeItem("user");
    navigate("/login");
  }

  const linkStyle = ({ isActive }) => ({
    padding: "6px 12px",
    borderRadius: 999,
    textDecoration: "none",
    color: "#e5e7eb",
    fontSize: 14,
    background: isActive ? "#111827" : "transparent",
  });

  // === Navbar minimal pentru paginile de login/register ===
  if (!isAuthenticated && isAuthPage) {
    return (
      <nav
        style={{
          width: "100%",
          borderBottom: "1px solid #111827",
          background: "#020617",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "10px 16px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Link
            to="/login"
            style={{
              color: "#e5e7eb",
              textDecoration: "none",
              fontWeight: 700,
              fontSize: 18,
              letterSpacing: 0.4,
            }}
          >
            AntiFoodWasteApp
          </Link>
        </div>
      </nav>
    );
  }

  // === Navbar complet pentru restul paginilor (după login) ===
  return (
    <nav
      style={{
        width: "100%",
        borderBottom: "1px solid #111827",
        background: "#020617",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "10px 16px",
          display: "flex",
          gap: 12,
          alignItems: "center",
        }}
      >
        <Link
          to="/"
          style={{
            color: "#e5e7eb",
            textDecoration: "none",
            fontWeight: 700,
            fontSize: 16,
            marginRight: 12,
          }}
        >
          AntiFoodWasteApp
        </Link>

        <NavLink to="/dashboard" style={linkStyle}>
          Dashboard
        </NavLink>
        <NavLink to="/groups" style={linkStyle}>
          Groups
        </NavLink>
        <NavLink to="/profile" style={linkStyle}>
          Profile
        </NavLink>
        <NavLink to="/recipes" style={linkStyle}>
          Recipes
        </NavLink>

        <div style={{ flex: 1 }} />

        {!isAuthenticated ? (
          <>
            <NavLink to="/login" style={linkStyle}>
              Login
            </NavLink>
            <NavLink to="/register" style={linkStyle}>
              Register
            </NavLink>
          </>
        ) : (
          <button
            onClick={logout}
            style={{
              padding: "6px 12px",
              borderRadius: 999,
              border: "1px solid #1f2933",
              background: "#111827",
              color: "#e5e7eb",
              cursor: "pointer",
              fontSize: 14,
            }}
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
