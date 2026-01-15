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

  const [groupName, setGroupName] = useState("");
  const [createdGroupId, setCreatedGroupId] = useState(null);

  const [groupId, setGroupId] = useState("");
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);

  const [users, setUsers] = useState([]);
  const [addUserId, setAddUserId] = useState("");

  const [available, setAvailable] = useState([]);

  useEffect(() => {
    if (groupId) localStorage.setItem("groupId", groupId);
  }, [groupId]);

  useEffect(() => {
    if (!userId) return;
    const saved = localStorage.getItem("groupId") || "";
    loadGroups(saved);
    loadUsers();
  }, [userId]);

  async function loadGroups(savedId) {
    setErr("");
    setLoading(true);
    try {
      const myGroups = await api.get(`/group/user/${userId}/groups`);
      setGroups(myGroups);

      if (myGroups.length === 0) {
        setGroupId("");
        setSelectedGroup(null);
        setAvailable([]);
        return;
      }

      let activeId;
      if (savedId && myGroups.some((g) => String(g.id) === String(savedId))) {
        activeId = String(savedId);
      } else {
        activeId = String(myGroups[0].id);
      }

      setGroupId(activeId);
      const active = myGroups.find((g) => String(g.id) === activeId);
      setSelectedGroup(active || null);
      await loadAvailableForGroup(activeId);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function loadUsers() {
    setErr("");
    try {
      const list = await api.get("/user");
      setUsers(list);
      const other = list.find((u) => u.id !== userId);
      setAddUserId(other ? String(other.id) : list[0] ? String(list[0].id) : "");
    } catch (e) {
      setErr(e.message);
    }
  }

  async function createGroup(e) {
    e.preventDefault();
    if (!groupName.trim()) return;

    setErr("");
    setLoading(true);

    try {
      const res = await api.post("/group/create", {
        groupName: groupName.trim(),
        creatorId: userId,
      });
      setCreatedGroupId(res.id);
      setGroupName("");

      try {
        await api.post("/group/addUser", {
          userId,
          groupId: res.id,
        });
      } catch {
        // dacă e deja membru, ignorăm
      }

      await loadGroups(res.id);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function addUserToGroup(e) {
    e.preventDefault();
    if (!groupId || !addUserId) return;

    setErr("");
    setLoading(true);
    try {
      await api.post("/group/addUser", {
        userId: Number(addUserId),
        groupId: Number(groupId),
      });
      await loadGroups(groupId);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function loadAvailableForGroup(id) {
    if (!id) return;
    setErr("");
    setLoading(true);

    try {
      const list = await api.get(`/group/${id}/available-food`);
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
      await loadAvailableForGroup(groupId);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSelectGroup(g) {
    const idString = String(g.id);
    setGroupId(idString);
    setSelectedGroup(g);
    await loadAvailableForGroup(g.id);
  }

  const selectedGroupName =
    selectedGroup?.groupName || selectedGroup?.name || "";

  return (
    <div className="groups">
      <h2>Grupuri</h2>
      <p>
        Utilizator curent: <b>{user?.username}</b>
      </p>

      {err && <p className="error">{err}</p>}
      {loading && <p>Se încarcă...</p>}

      <div className="groupsGrid">
        <div className="card">
          <h3>Creează grup</h3>
          <form onSubmit={createGroup}>
            <div className="formRow">
              <label>Nume grup</label>
              <input
                className="input"
                value={groupName}
                placeholder="ex: Camin Camera 302"
                onChange={(e) => setGroupName(e.target.value)}
              />
            </div>
            <button className="btn">Creează</button>
          </form>

          {createdGroupId && (
            <p style={{ marginTop: 8, opacity: 0.9 }}>
              Grup creat <span style={{ fontSize: 12 }}>ID: {createdGroupId}</span>
            </p>
          )}

          <div style={{ marginTop: 16 }}>
            <h4>Grupurile mele</h4>

            {groups.length === 0 ? (
              <p style={{ opacity: 0.8 }}>Nu faci parte din niciun grup.</p>
            ) : (
              <ul style={{ paddingLeft: 18 }}>
                {groups.map((g) => (
                  <li key={g.id}>
                    <button
                      type="button"
                      onClick={() => handleSelectGroup(g)}
                      style={{
                        background: "none",
                        border: "none",
                        padding: 0,
                        margin: 0,
                        cursor: "pointer",
                        color: "white",
                      }}
                    >
                      <b>{g.groupName || g.name}</b>{" "}
                      <span style={{ opacity: 0.8 }}>
                        — {g.Users?.length || 0} membri
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {selectedGroup && (
              <div
                style={{
                  borderTop: "1px solid #333",
                  paddingTop: 10,
                  marginTop: 10,
                }}
              >
                <h4>Detalii: {selectedGroupName}</h4>
                <p style={{ opacity: 0.7, fontSize: 13 }}>
                  ID grup: {selectedGroup.id}
                </p>

                <b>Membri</b>
                {selectedGroup.Users?.length ? (
                  <ul style={{ paddingLeft: 18 }}>
                    {selectedGroup.Users.map((u) => (
                      <li key={u.id}>
                        {u.username}
                        {u.tag && <span className="tag-pill">{u.tag}</span>}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ opacity: 0.8 }}>Niciun membru.</p>
                )}

                <b style={{ display: "block", marginTop: 10 }}>
                  Mâncare rezervată
                </b>
                {available.filter((it) => it.claim != null).length === 0 ? (
                  <p style={{ opacity: 0.8 }}>Nimic rezervat în acest grup.</p>
                ) : (
                  <ul style={{ paddingLeft: 18 }}>
                    {available
                      .filter((it) => it.claim != null)
                      .map((it) => (
                        <li key={it.id}>
                          {it.productName} ({it.category}) — rezervat de{" "}
                          <b>{it.claimer?.username || "necunoscut"}</b>
                        </li>
                      ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Administrare grup */}
        <div className="card">
          <h3>Administrare grup</h3>
          <div className="formRow">
            <label>Grup activ</label>
            <select
              className="input"
              value={groupId}
              onChange={(e) => {
                const id = e.target.value;
                const g = groups.find((gr) => String(gr.id) === String(id));
                if (g) handleSelectGroup(g);
              }}
            >
              {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.groupName || g.name}
                </option>
              ))}
            </select>
          </div>

          <form onSubmit={addUserToGroup}>
            <div className="formRow">
              <label>Adaugă utilizator</label>
              <select
                className="input"
                value={addUserId}
                onChange={(e) => setAddUserId(e.target.value)}
              >
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.username}
                    {u.tag ? ` – ${u.tag}` : ""}
                  </option>
                ))}
              </select>
            </div>

            <button className="btn" disabled={!groupId || !addUserId}>
              Adaugă
            </button>
          </form>

          <button
            className="btn"
            style={{ marginTop: 12 }}
            onClick={() => loadAvailableForGroup(groupId)}
          >
            Actualizează produse
          </button>
        </div>
      </div>

      {/* Alimente disponibile */}
      <div className="card" style={{ marginTop: 24 }}>
        <h3>
          Produse disponibile{selectedGroupName ? `: ${selectedGroupName}` : ""}
        </h3>

        {available.filter((it) => it.claim == null).length === 0 ? (
          <p style={{ opacity: 0.8 }}>Nu există produse disponibile momentan.</p>
        ) : (
          <div style={{ display: "grid", gap: 10 }}>
            {available
              .filter((it) => it.claim == null)
              .map((it) => (
                <div className="itemRow" key={it.id}>
                  <div>
                    <div className="itemTitle">
                      {it.productName} <span>({it.category})</span>
                    </div>
                    <div className="meta">expiră la: {it.expiryDate}</div>
                    <div className="meta">
                      oferit de: <b>{it.proprietar?.username}</b>
                      {it.proprietar?.tag && (
                        <span className="tag-pill">{it.proprietar.tag}</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <button className="btn" onClick={() => claimItem(it.id)}>
                      Rezervă
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
