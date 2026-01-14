// frontend/app/src/pages/Login.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as api from "../api/client";
import "./Auth.css";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    <div className="auth">
      <div className="authCard authCard-large">
        <h2 className="authTitle">Login</h2>

        <form onSubmit={onSubmit}>
          <div className="authRow">
            <label>Email</label>
            <input
              className="authInput"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ex: ceva@mail.com"
            />
          </div>

          <div className="authRow">
            <label>Password</label>
            <input
              className="authInput"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Introdu parola"
            />
          </div>

          <button className="authBtn">Login</button>
        </form>

        {err && <p className="authErr">{err}</p>}

        <p className="authFooterText">
          Nu ai cont? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}
