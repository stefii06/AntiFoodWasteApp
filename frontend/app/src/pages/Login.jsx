import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import * as api from "../api/client";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("eli@test.com");
  const [password, setPassword] = useState("123");
  const [err, setErr] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");

    try {
      const res = await api.post("/user/login", { email, password });
      localStorage.setItem("user", JSON.stringify(res.user));
      navigate("/dashboard");
    } catch (e) {
      setErr(e.message);
    }
  }

  return (
    <div style={{ padding: 24, maxWidth: 420, margin: "0 auto" }}>
      <h2>Login</h2>

      <form onSubmit={onSubmit}>
        <div style={{ marginBottom: 10 }}>
          <label>Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        <div style={{ marginBottom: 10 }}>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        <button style={{ padding: "8px 12px" }}>Login</button>
      </form>

      {err && <p style={{ color: "crimson" }}>{err}</p>}

      <p style={{ marginTop: 10 }}>
        Nu ai cont? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}
