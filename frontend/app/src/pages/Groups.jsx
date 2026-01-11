import { useEffect, useMemo, useState } from "react";
import * as api from "../api/client";
import "./Groups.css";

export default function Groups() {
  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  }, []);
  const userId = user?.id;

  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  // create group
  const [groupName, setGroupName] = useState("Camin Camera 302");
  const [createdGroupId, setCreatedGroupId] = useState(null);

  // working group id (for viewing / adding)
  const [groupId, setGroupId] = useState(() => localStorage.getItem("groupId") || "1");

  // add user to group
  const [addUserId, setAddUserId] = useState("2"); // default pt demo

  // available food
  const [available, setAvailable] = useState([]);

  useEffect(() => {
    localStorage.setItem("groupId", groupId);
  }, [groupId]);

  async function createGroup(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const res = await api.post("/group/create", { groupName });
      setCreatedGroupId(res.id);
      setGroupId(String(res.id)); // ne mutam automat pe grupul creat
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function addUserToGroup(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await api.post("/group/addUser", {
        userId: Number(addUserId),
        groupId: Number(groupId),
      });
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function loadAvailable() {
    setErr("");
    setLoading(true);
    try {
      const list = await api.get(`/group/${groupId}/available-food`);
      setAvailable(list);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function claimItem(itemId) {
    setErr("");
    setLoading(true);
    try {
      await api.put(`/food/${itemId}/claimItem`, { claimerId: userId });
      await loadAvailable();
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="groups">
      <h2>Groups</h2>
      <p>
        Logat ca <b>{user?.username}</b> (id={userId})
      </p>

      {err && <p className="error">{err}</p>}
      {loading && <p>Loading...</p>}

      <div className="groupsGrid">
        {/* CREATE GROUP */}
        <div className="card">
          <h3>Create group</h3>
          <form onSubmit={createGroup}>
            <div className="formRow">
              <label>Group name</label>
              <input
                className="input"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              />
            </div>
            <button className="btn">Create</button>
          </form>

          {createdGroupId && (
            <p style={{ marginTop: 10 }}>
              Grup creat! <b>groupId = {createdGroupId}</b>
            </p>
          )}
        </div>

        {/* ADD USER + SELECT GROUP */}
        <div className="card">
          <h3>Manage group</h3>

          <div className="formRow">
            <label>Group ID</label>
            <input className="input" value={groupId} onChange={(e) => setGroupId(e.target.value)} />
          </div>

          <form onSubmit={addUserToGroup}>
            <div className="formRow">
              <label>Add userId to this group</label>
              <input
                className="input"
                value={addUserId}
                onChange={(e) => setAddUserId(e.target.value)}
              />
            </div>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button className="btn" type="submit">
                Add user
              </button>
              <button
                className="btn"
                type="button"
                onClick={() => setAddUserId(String(userId))}
                title="Seteaza userId-ul meu"
              >
                Set me
              </button>
            </div>
          </form>

          <div style={{ marginTop: 14 }}>
            <button className="btn" onClick={loadAvailable}>
              Load available food
            </button>
          </div>
        </div>
      </div>

      {/* AVAILABLE FOOD LIST */}
      <div className="card" style={{ marginTop: 24 }}>
        <h3>Available food in group {groupId}</h3>

        {available.length === 0 ? (
          <p>Nimic disponibil (sau nu ai dat Load).</p>
        ) : (
          <div style={{ display: "grid", gap: 10 }}>
            {available.map((it) => (
              <div className="itemRow" key={it.id}>
                <div>
                  <div className="itemTitle">
                    {it.productName} <span style={{ fontWeight: 400 }}>({it.category})</span>
                  </div>
                  <div className="meta">exp: {it.expiryDate}</div>
                  <div className="meta">
                    owner: <b>{it.proprietar?.username || "?"}</b> — tag:{" "}
                    <b>{it.proprietar?.tag || "?"}</b>
                  </div>
                </div>

                <div>
                  <button className="btn" onClick={() => claimItem(it.id)}>
                    Claim
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <p style={{ marginTop: 14, opacity: 0.8 }}>
        Tip: ca să apară produse aici, în Dashboard trebuie să ai un item cu{" "}
        <b>availability=true</b> și <b>claim=null</b> (adică “Make available” și să nu fie claim-uit).
      </p>
    </div>
  );
}
