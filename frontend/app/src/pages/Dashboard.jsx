import { useEffect, useMemo, useState } from "react";
import * as api from "../api/client";
import { getShareData } from "../api/client";

import "./Dashboard.css";

export default function Dashboard() {
  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  }, []);

  const userId = user?.id;

  const [items, setItems] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("Lactate");
  const [expiryDate, setExpiryDate] = useState("");

  // 🔔 popup scurt pentru alerta de expirare
  const [expiryPopup, setExpiryPopup] = useState("");

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
  }, [userId]);

  // închidem automat popup-ul după câteva secunde
  useEffect(() => {
    if (!expiryPopup) return;
    const t = setTimeout(() => setExpiryPopup(""), 4000);
    return () => clearTimeout(t);
  }, [expiryPopup]);

  async function onAdd(e) {
    e.preventDefault();
    setErr("");

    if (!productName.trim() || !expiryDate) {
      setErr("Completează Nume produs și Data expirare.");
      return;
    }

    try {
      await api.post("/food/addItem", {
        productName: productName.trim(),
        category: category.trim() || "Altele",
        expiryDate,
        userId,
      });

      // 🔔 verificăm dacă intră în intervalul de alertă (azi–7 zile)
      try {
        const today = new Date();
        const todayMidnight = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate()
        );
        const nextWeek = new Date(todayMidnight);
        nextWeek.setDate(nextWeek.getDate() + 7);

        const exp = new Date(expiryDate); // YYYY-MM-DD

        if (exp >= todayMidnight && exp <= nextWeek) {
          setExpiryPopup(
            `Atenție: produsul „${productName.trim()}” expiră curând (${expiryDate}).`
          );
        }
      } catch {
        // ignore doar la popup
      }

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

  // 🔁 toggle disponibil / indisponibil
  async function onToggleAvailability(id) {
    setErr("");
    try {
      await api.put(`/food/${id}/toggleAvailability`);
      await loadAll();
    } catch (e) {
      setErr(e.message);
    }
  }

  /**
   * SHARE PE FACEBOOK
   * - dacă browserul suportă Web Share API -> navigator.share(...)
   * - altfel fallback la Facebook Share Dialog (sharer.php)
   */
  async function shareOnFacebook(foodId) {
    try {
      const data = await getShareData(foodId);

      const shareUrl = data.fbShareUrl || window.location.origin;
      const shareText = data.message || "Vezi ce aliment pot să ofer:";

      if (navigator.share) {
        await navigator.share({
          title: "Anti Food Waste",
          text: shareText,
          url: shareUrl,
        });
      } else {
        const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          shareUrl
        )}&quote=${encodeURIComponent(shareText)}`;
        window.open(url, "_blank", "noopener,noreferrer");
      }
    } catch (e) {
      console.error(e);
      alert("Nu am putut pregăti share-ul pe Facebook.");
    }
  }

  /**
   * SHARE PE INSTAGRAM
   * - dacă există Web Share API -> navigator.share(...)
   * - altfel: copiem textul în clipboard + deschidem instagramUrl
   */
  async function shareOnInstagram(foodId) {
    try {
      const data = await getShareData(foodId);

      const shareUrl = data.instagramUrl || window.location.origin;
      const shareText =
        data.message || "Vezi ce aliment pot să ofer în Anti Food Waste:";

      if (navigator.share) {
        await navigator.share({
          title: "Anti Food Waste",
          text: shareText,
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareText);
        alert(
          "Text copiat în clipboard! Lipește-l în postarea sau story-ul de pe Instagram."
        );

        if (data.instagramUrl) {
          window.open(data.instagramUrl, "_blank", "noopener,noreferrer");
        }
      }
    } catch (e) {
      console.error(e);
      alert("Nu am putut pregăti share-ul pentru Instagram.");
    }
  }

  const itemsByCategory = items.reduce((acc, it) => {
    const cat = it.category || "Altele";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(it);
    return acc;
  }, {});

  return (
    <div className="dashboard-page">
      <div className="dashboard-shell">
        <div className="dashboard">
          <header className="dashboard-header">
            <div>
              <h2>Dashboard</h2>
              <p className="dashboard-subtitle">
                Logat ca <b>{user?.username}</b>
              </p>
            </div>
          </header>

          {/* 🔔 Popup vizual pentru alimente aproape de expirare */}
          {expiryPopup && (
            <div className="expiry-toast">
              <span>{expiryPopup}</span>
              <button
                type="button"
                className="expiry-toast-close"
                onClick={() => setExpiryPopup("")}
              >
                ✕
              </button>
            </div>
          )}

          {err && <p className="error">{err}</p>}
          {loading && <p className="infoText">Se încarcă...</p>}

          <div className="dashboard-grid">
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

            <div className="card alertsCard">
              <div className="alertsHeader">
                <div>
                  <h3>Produse aproape de expirare</h3>
                  <p className="alertsSubtitle">
                    Folosește-le sau dă-le mai departe
                  </p>
                </div>
                <button className="btn ghost" type="button" onClick={loadAll}>
                  Refresh
                </button>
              </div>

              {alerts.length === 0 ? (
                <p className="infoText">Nicio alertă momentan 🎉</p>
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

          <div className="card itemsWrap">
            <h3>Alimentele mele</h3>

            {items.length === 0 ? (
              <p className="infoText">Nu ai produse înregistrate.</p>
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
                        let availabilityLabel = "Indisponibil";
                        let availabilityClass = "is-private";

                        if (it.availability === true && it.claim == null) {
                          availabilityLabel = "Disponibil";
                          availabilityClass = "is-available";
                        } else if (it.claim != null) {
                          availabilityLabel = "Rezervat";
                          availabilityClass = "is-reserved";
                        }

                        const canToggle = it.claim == null;

                        return (
                          <div className="itemRow" key={it.id}>
                            <div>
                              <div className="itemTitle">
                                {it.productName}
                              </div>
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

                              {canToggle && it.availability === false && (
                                <button
                                  className="btn subtle"
                                  onClick={() => onToggleAvailability(it.id)}
                                >
                                  Fă disponibil
                                </button>
                              )}

                              {canToggle && it.availability === true && (
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
                                  <button
                                    className="btn subtle"
                                    onClick={() => onToggleAvailability(it.id)}
                                  >
                                    Marchează privat
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
