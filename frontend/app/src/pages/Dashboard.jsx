import { useEffect, useMemo, useState } from "react";
import * as api from "../api/client";
import { getShareData } from "../api/client";

import "./Dashboard.css";

export default function Dashboard() {
  // ----- Auth (din localStorage)
  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  }, []);

  const userId = user?.id;

  // ----- Data
  const [items, setItems] = useState([]);
  const [alerts, setAlerts] = useState([]);

  // UI state
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // ----- Add form
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("Lactate");
  const [expiryDate, setExpiryDate] = useState("");

  // ---------------- Helpers
  async function loadAll() {
    if (!userId) return;
    setErr("");
    setLoading(true);
    try {
      const foods = await api.get(`/food/user/${userId}/showUsersItems`);
      setItems(foods);

      const al = await api.get(`/food/user/${userId}/alerts`);
      setAlerts(al);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  // ---------------- Actions: CRUD
  async function onAdd(e) {
    e.preventDefault();
    setErr("");

    if (!productName.trim() || !expiryDate) {
      setErr("Completeaza Nume produs si Data expirare.");
      return;
    }

    try {
      await api.post("/food/addItem", {
        productName: productName.trim(),
        category: category.trim() || "Altele",
        expiryDate,
        userId,
      });
      setProductName("");
      setExpiryDate("");
      await loadAll();
    } catch (e) {
      setErr(e.message);
    }
  }

  async function onDelete(id) {
    setErr("");
    try {
      await api.del(`/food/${id}/deleteItem`);
      await loadAll();
    } catch (e) {
      setErr(e.message);
    }
  }

  async function onMakeAvailable(id) {
    setErr("");
    try {
      await api.put(`/food/${id}/makeAvailableItem`);
      await loadAll();
    } catch (e) {
      setErr(e.message);
    }
  }

  // ---------------- Share FB / IG
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
      alert("Textul a fost copiat! Lipește-l în postarea de pe Instagram.");
      window.open(data.instagramUrl, "_blank", "noopener,noreferrer");
    } catch (e) {
      console.error(e);
      alert("Nu am putut pregăti share-ul pentru Instagram");
    }
  }

  // ---------------- Derived: grupare pe categorii
  const itemsByCategory = items.reduce((acc, it) => {
    const cat = it.category || "Altele";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(it);
    return acc;
  }, {});

  // ---------------- UI
  return (
    <div className="dashboard-page">
      <div className="dashboard-shell">
        <div className="dashboard">
          <header className="dashboard-header">
            <div>
              <h2>Dashboard</h2>
              <p className="dashboard-subtitle">
                Logat ca <b>{user?.username}</b> (id={userId})
              </p>
            </div>
          </header>

          {err && <p className="error">{err}</p>}
          {loading && <p className="infoText">Se încarcă...</p>}

          {/* TOP GRID: Add + Alerts */}
          <div className="dashboard-grid">
            {/* Add */}
            <div className="card">
              <h3>Adaugă aliment</h3>

              <form onSubmit={onAdd}>
                <div className="formRow">
                  <label>Nume produs</label>
                  <input
                    className="input"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="ex: Lapte"
                  />
                </div>

                <div className="formRow">
                  <label>Categorie</label>
                  <input
                    className="input"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="ex: Lactate"
                  />
                </div>

                <div className="formRow">
                  <label>Data expirare</label>
                  <input
                    className="input"
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                  />
                </div>

                <button className="btn primary fullWidth">Adaugă</button>
              </form>
            </div>

            {/* Alerts */}
            <div className="card alertsCard">
              <div className="alertsHeader">
                <div>
                  <h3>Produse aproape de expirare</h3>
                  <p className="alertsSubtitle">
                    Ai grijă să le folosești sau să le oferi mai departe.
                  </p>
                </div>
                <button className="btn ghost" type="button" onClick={loadAll}>
                  Refresh
                </button>
              </div>

              {alerts.length === 0 ? (
                <p className="infoText">
                  Nu ai alerte momentan. Frigiderul tău arată bine! 🎉
                </p>
              ) : (
                <ul className="alertsList">
                  {alerts.map((a) => (
                    <li key={a.id} className="alertItem">
                      <div>
                        <div className="alertName">{a.productName}</div>
                        <div className="alertMeta">
                          Expiră la <b>{a.expiryDate}</b>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* ITEMS LIST */}
          <div className="card itemsWrap">
            <h3>Alimentele mele</h3>

            {items.length === 0 ? (
              <p className="infoText">
                Nu ai alimente înregistrate. Începe prin a adăuga câteva mai sus.
              </p>
            ) : (
              <div className="categoriesWrap">
                {Object.entries(itemsByCategory).map(([cat, list]) => (
                  <div key={cat} className="categoryBlock">
                    <div className="categoryHeader">
                      <h4 className="categoryTitle">{cat}</h4>
                      <span className="categoryCount">
                        {list.length} produs{list.length > 1 ? "e" : ""}
                      </span>
                    </div>

                    <div className="categoryItems">
                      {list.map((it) => {
                        const availabilityLabel = it.availability
                          ? "Available"
                          : "Not available";
                        const availabilityClass = it.availability
                          ? "is-available"
                          : "is-not-available";

                        return (
                          <div className="itemRow" key={it.id}>
                            <div>
                              <div className="itemTitle">{it.productName}</div>
                              <div className="itemMetaLine">
                                <span className="itemExpiry">
                                  Expiră la <b>{it.expiryDate}</b>
                                </span>
                                <span
                                  className={`availabilityPill ${availabilityClass}`}
                                >
                                  {availabilityLabel}
                                </span>
                              </div>
                            </div>

                            <div className="actions">
                              <button
                                className="btn subtle-danger"
                                onClick={() => onDelete(it.id)}
                              >
                                Delete
                              </button>

                              {!it.availability && (
                                <button
                                  className="btn subtle"
                                  onClick={() => onMakeAvailable(it.id)}
                                >
                                  Make available
                                </button>
                              )}

                              {it.availability && (
                                <>
                                  <button
                                    className="btn subtle"
                                    onClick={() => shareOnFacebook(it.id)}
                                  >
                                    Share pe Facebook
                                  </button>
                                  <button
                                    className="btn subtle"
                                    onClick={() => shareOnInstagram(it.id)}
                                  >
                                    Share pe Instagram
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
