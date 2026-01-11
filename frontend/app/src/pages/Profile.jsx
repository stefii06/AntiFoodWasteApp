import { useEffect, useMemo, useState } from "react";
import * as api from "../api/client";

export default function Profile() {
  const user = useMemo(() => {
    try { return JSON.parse(localStorage.getItem("user") || "null"); }
    catch { return null; }
  }, []);

  const userId = user?.id;

  const [profile, setProfile] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      if (!userId) return;
      setErr("");
      setLoading(true);
      try {
        const data = await api.get(`/user/${userId}`);
        setProfile(data);
      } catch (e) {
        setErr(e.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [userId]);

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <h2>Profile</h2>

      {loading && <p>Loading...</p>}
      {err && <p style={{ color: "crimson" }}>{err}</p>}

      {profile && (
        <div style={{ border: "1px solid #333", borderRadius: 12, padding: 16 }}>
          <p><b>Username:</b> {profile.username}</p>
          <p><b>Email:</b> {profile.email}</p>
          <p><b>Tag:</b> {profile.tag}</p>
        </div>
      )}
    </div>
  );
}
