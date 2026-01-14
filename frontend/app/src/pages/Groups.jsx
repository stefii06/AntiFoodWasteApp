// frontend/app/src/pages/Groups.jsx
import { useEffect, useMemo, useState } from "react";
import * as api from "../api/client";
import { getShareData } from "../api/client";

import "./Groups.css";

export default function Groups() {
  // ----- Auth
  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  }, []);
  const userId = user?.id;

  // ----- State
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const [groupName, setGroupName] = useState("Camin Camera 302");
  const [createdGroupId, setCreatedGroupId] = useState(null);

  const [groupId, setGroupId] = useState(""); // grup selectat
  const [groups, setGroups] = useState([]); // grupurile mele
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [users, setUsers] = useState([]); // toti userii

  const [addUserId, setAddUserId] = useState(""); // user selectat pt add
  const [available, setAvailable] = useState([]); // alimente disponibile in grup

  // salvăm groupId în localStorage ca să rămână selectat
  useEffect(() => {
    if (groupId) {
      localStorage.setItem("groupId", groupId);
    }
  }, [groupId]);

  // load initial: grupuri + useri
  useEffect(() => {
    if (!userId) return;

    const savedGroupId = localStorage.getItem("groupId") || "";
    loadGroups(savedGroupId);
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  // ----- API helpers
  async function loadGroups(savedGroupId) {
    setErr("");
    setLoading(true);
    try {
      const myGroups = await api.get(`/group/user/${userId}/groups`);
      setGroups(myGroups);

      if (myGroups.length > 0) {
        let activeId;

        // dacă avem deja un grup salvat și există în listă, îl folosim
        if (
          savedGroupId &&
          myGroups.some((g) => String(g.id) === String(savedGroupId))
        ) {
          activeId = String(savedGroupId);
        } else {
          // altfel luăm primul grup din listă
          activeId = String(myGroups[0].id);
        }

        setGroupId(activeId);
        const activeGroup = myGroups.find((g) => String(g.id) === activeId);
        setSelectedGroup(activeGroup || null);
      } else {
        setGroupId("");
        setSelectedGroup(null);
      }
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function loadUsers() {
    setErr("");
    try {
      const list = await api.get("/user"); // lista tuturor userilor
      setUsers(list);

      // default: primul user diferit de mine, daca exista
      const other = list.find((u) => u.id !== userId);
      setAddUserId(other ? String(other.id) : list[0] ? String(list[0].id) : "");
    } catch (e) {
      setErr(e.message);
    }
  }

  // ----- Create group
  async function createGroup(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      // trimitem si userId, daca vrei sa marchezi creatorul in backend
      const res = await api.post("/group/create", { groupName, creatorId: userId });
      setCreatedGroupId(res.id);

      // dupa creare, il adaugam automat pe mine in grup (daca in backend nu faci deja asta)
      try {
        await api.post("/group/addUser", {
          userId,
          groupId: res.id,
        });
      } catch {
        // daca backend-ul deja il adauga, nu e tragedie daca pica
      }

      await loadGroups(res.id);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  // ----- Share FB / IG
  async function shareOnFacebook(foodId) {
    try {
      const data = await getShareData(foodId);
      window.open(data.fbShareUrl, "_blank", "noopener,noreferrer");
    } catch (e) {
      console.error(e);
      alert("Nu am putut pregăti share-ul pe Facebook");
    }
  }

  async function shareOnInstagram(foodId) {
    try {
      const data = await getShareData(foodId);
      await navigator.clipboard.writeText(data.message);
      alert("Textul a fost copiat. Postează pe Instagram și dă paste!");
      window.open(data.instagramUrl, "_blank", "noopener,noreferrer");
    } catch (e) {
      console.error(e);
      alert("Nu am putut pregăti share-ul pentru Instagram");
    }
  }

  // ----- Add user to group
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
      await loadGroups(groupId); // refresh lista de membrii
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  // ----- Load available food for current group
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

  // butonul existent va apela acum:
  async function loadAvailable() {
    await loadAvailableForGroup(groupId);
  }

  // ----- Claim item
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

  async function handleSelectGroup(g) {
    const idStr = String(g.id);
    setGroupId(idStr);
    setSelectedGroup(g);
    await loadAvailableForGroup(g.id);
  }

  // pentru titlul "Available food in group ..."
  const currentGroup =
    groups.find((g) => String(g.id) === String(groupId)) || null;
  const currentGroupName =
    currentGroup?.groupName || currentGroup?.name || "";

  // ----- UI
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
              Grup creat!{" "}
              <span style={{ opacity: 0.8 }}>ID grup: {createdGroupId}</span>
            </p>
          )}

          {/* 🔹 LISTA GRUPURILOR MELE */}
          <div style={{ marginTop: 16 }}>
            <h4>Grupurile mele</h4>

            {groups.length === 0 ? (
              <p style={{ opacity: 0.8 }}>Nu ești în niciun grup.</p>
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
                        color: "#fff",
                        textAlign: "left",
                      }}
                    >
                      <b>{g.groupName || g.name}</b>{" "}
                      — {g.Users?.length || 0} membri
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {selectedGroup && (
              <div
                style={{
                  marginTop: 12,
                  paddingTop: 10,
                  borderTop: "1px solid #333",
                  fontSize: 14,
                }}
              >
                <h4 style={{ marginBottom: 4 }}>
                  Detalii grup:{" "}
                  {selectedGroup.groupName || selectedGroup.name}
                </h4>
                <p
                  style={{
                    opacity: 0.8,
                    fontSize: 13,
                    marginBottom: 8,
                  }}
                >
                  ID grup: <b>{selectedGroup.id}</b>
                </p>

                {/* Membrii grupului */}
                <div style={{ marginBottom: 8 }}>
                  <b>Membri:</b>
                  {selectedGroup.Users && selectedGroup.Users.length > 0 ? (
                    <ul style={{ paddingLeft: 18, marginTop: 4 }}>
                      {selectedGroup.Users.map((u) => (
                        <li key={u.id}>
                          {u.username}{" "}
                          <span style={{ opacity: 0.8 }}>
                            ({u.tag || "fără tag"})
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p style={{ opacity: 0.8, marginTop: 4 }}>
                      Niciun membru încă.
                    </p>
                  )}
                </div>

                {/* Mâncare claim-uită */}
                <div>
                  <b>Mâncare claim-uită:</b>
                  {available.filter((it) => it.claim != null).length === 0 ? (
                    <p style={{ opacity: 0.8, marginTop: 4 }}>
                      Niciun produs claim-uit în acest grup.
                    </p>
                  ) : (
                    <ul style={{ paddingLeft: 18, marginTop: 4 }}>
                      {available
                        .filter((it) => it.claim != null)
                        .map((it) => {
                          const claimer = users.find(
                            (u) => u.id === it.claim
                          );
                          return (
                            <li key={it.id}>
                              {it.productName} ({it.category}) — rezervat de{" "}
                              <b>
                                {claimer?.username ||
                                  `user #${it.claim}`}
                              </b>
                            </li>
                          );
                        })}
                    </ul>
                  )}
                  <p
                    style={{
                      fontSize: 12,
                      opacity: 0.7,
                      marginTop: 4,
                    }}
                  >
                    (Lista se actualizează când selectezi grupul sau
                    apeși <i>Load available food</i>.)
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* MANAGE GROUP */}
        <div className="card">
          <h3>Manage group</h3>

          {/* select grup */}
          <div className="formRow">
            <label>Group</label>

            <select
              className="input"
              value={groupId}
              onChange={(e) => {
                const id = e.target.value;
                const g = groups.find(
                  (gr) => String(gr.id) === String(id)
                );
                if (g) {
                  handleSelectGroup(g);
                }
              }}
            >
              {groups.length === 0 && (
                <option value="">Niciun grup</option>
              )}
              {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.groupName || g.name}
                </option>
              ))}
            </select>
          </div>

          {/* select user de adaugat */}
          <form onSubmit={addUserToGroup}>
            <div className="formRow">
              <label>Add user to this group</label>

              <select
                className="input"
                value={addUserId}
                onChange={(e) => setAddUserId(e.target.value)}
              >
                {users.length === 0 && <option value="">No users</option>}
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.username} ({u.tag || "fara tag"})
                  </option>
                ))}
              </select>
            </div>

            <div
              style={{
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
              }}
            >
              <button
                className="btn"
                type="submit"
                disabled={!groupId || !addUserId}
              >
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
            <button
              className="btn"
              onClick={loadAvailable}
              disabled={!groupId}
            >
              Load available food
            </button>
          </div>
        </div>
      </div>

      {/* AVAILABLE FOOD LIST */}
      <div className="card" style={{ marginTop: 24 }}>
        <h3>Available food in group {currentGroupName || "-"}</h3>

        {available.length === 0 ? (
          <p>Nimic disponibil (sau nu ai dat Load).</p>
        ) : (
          <div style={{ display: "grid", gap: 10 }}>
            {available.map((it) => (
              <div className="itemRow" key={it.id}>
                <div>
                  <div className="itemTitle">
                    {it.productName}{" "}
                    <span style={{ fontWeight: 400 }}>
                      ({it.category})
                    </span>
                  </div>
                  <div className="meta">exp: {it.expiryDate}</div>
                  <div className="meta">
                    owner:{" "}
                    <b>{it.proprietar?.username || "?"}</b> — tag:{" "}
                    <b>{it.proprietar?.tag || "?"}</b>
                  </div>
                </div>

                <div>
                  <button
                    className="btn"
                    onClick={() => claimItem(it.id)}
                  >
                    Claim
                  </button>

                  <button
                    className="btn"
                    onClick={() => shareOnFacebook(it.id)}
                  >
                    Share FB
                  </button>
                  <button
                    className="btn"
                    onClick={() => shareOnInstagram(it.id)}
                  >
                    Share IG
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <p style={{ marginTop: 14, opacity: 0.8 }}>
        Tip: ca să apară produse aici, în Dashboard trebuie să ai un item
        cu <b>availability=true</b> și <b>claim=null</b> (adică “Make
        available” și să nu fie claim-uit).
      </p>
    </div>
  );
}
