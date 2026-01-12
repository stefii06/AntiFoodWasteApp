import { Link, NavLink, useNavigate } from "react-router-dom";

export default function NavBar() {
  const navigate = useNavigate();
  const user = localStorage.getItem("user");

  function logout() {
    localStorage.removeItem("user");
    navigate("/login");
  }

  const linkStyle = ({ isActive }) => ({
    padding: "8px 10px",
    borderRadius: 8,
    textDecoration: "none",
    color: "white",
    background: isActive ? "#333" : "transparent",
  });

  return (
    <div
      style={{
        display: "flex",
        gap: 12,
        alignItems: "center",
        padding: 12,
        borderBottom: "1px solid #333",
      }}
    >
      <Link to="/" style={{ color: "white", textDecoration: "none", fontWeight: 700 }}>
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

      {!user ? (
        <>
          <NavLink to="/login" style={linkStyle}>
            Login
          </NavLink>
          <NavLink to="/register" style={linkStyle}>
            Register
          </NavLink>
        </>
      ) : (
        <button onClick={logout} style={{ padding: "8px 10px", borderRadius: 8 }}>
          Logout
        </button>
      )}
    </div>
  );
}
