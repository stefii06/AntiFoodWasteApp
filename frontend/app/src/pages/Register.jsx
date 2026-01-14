// frontend/app/src/pages/Register.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as api from "../api/client";
import "./Auth.css";

export default function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tag, setTag] = useState("Vegetarian");

  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setMsg("");

    try {
      const res = await api.post("/user/register", {
        username,
        email,
        password,
        tag,
      });
      setMsg(`Cont creat cu succes! (id=${res.id})`);
      setTimeout(() => navigate("/login"), 600);
    } catch (e) {
      setErr(e.message);
    }
  }

  return (
    <div className="auth">
      <div className="authCard authCard-large">
        <h2 className="authTitle">Register</h2>

        <form onSubmit={onSubmit}>
          <div className="authRow">
            <label>Username</label>
            <input
              className="authInput"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="ex: olga"
            />
          </div>

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
              placeholder="Alege o parolă"
            />
          </div>

          <div className="authRow">
            <label>Preferințe (tag)</label>
            <input
              className="authInput"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              placeholder="ex: Vegetarian, iubitor de zacuscă"
            />
          </div>

          <button className="authBtn">Create account</button>
        </form>

        {msg && <p className="authOk">{msg}</p>}
        {err && <p className="authErr">{err}</p>}

        <p className="authFooterText">
          Ai cont deja? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
