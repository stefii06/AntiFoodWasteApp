import { useEffect, useMemo, useState } from "react";
import * as api from "../api/client";
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

  // External recipes
  const [recipes, setRecipes] = useState([]);
  const [recipesLoading, setRecipesLoading] = useState(false);

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

      // dacă s-au schimbat alerts, resetăm rețetele (opțional)
      setRecipes([]);
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

  // ---------------- Social Share
  async function shareItem(item) {
    // Share link către pagina Groups (unde se vede available-food în grup)
    const url = `${window.location.origin}/groups`;
    const text = `AntiFoodWasteApp: Ofer ${item.productName} (${item.category}), exp: ${item.expiryDate}.`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "AntiFoodWasteApp - produs disponibil",
          text,
          url,
        });
        return;
      }

      // fallback: copy to clipboard
      await navigator.clipboard.writeText(`${text}\n${url}`);
      alert("Descriere + link copiate in clipboard ✅");
    } catch (e) {
      // dacă clipboard e blocat sau user a dat cancel
      try {
        window.prompt("Copiaza manual textul:", `${text}\n${url}`);
      } catch {
        // ignore
      }
    }
  }

  // ---------------- External API (recipes)
  async function loadRecipes() {
    setErr("");

    if (!alerts || alerts.length === 0) {
      setRecipes([]);
      return;
    }

    const ingredient = alerts[0].productName; // folosim primul alert ca demo ingredient
    setRecipesLoading(true);

    try {
      const url = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${encodeURIComponent(
        ingredient
      )}`;
      const res = await fetch(url);
      const data = await res.json();
      setRecipes(data.meals?.slice(0, 6) || []);
    } catch {
      setErr("Nu am putut incarca retete (serviciu extern).");
    } finally {
      setRecipesLoading(false);
    }
  }

  // ---------------- UI
  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <p>
        Logat ca <b>{user?.username}</b> (id={userId})
      </p>

      {err && <p className="error">{err}</p>}
      {loading && <p>Loading...</p>}

      {/* TOP GRID: Add + Alerts */}
      <div className="dashboard-grid">
        {/* Add */}
        <div className="card">
          <h3>Adauga aliment</h3>

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

            <button className="btn">Adauga</button>
          </form>
        </div>

        {/* Alerts + Recipes */}
        <div className="card">
          <h3>Produse aproape de expirare</h3>

          {alerts.length === 0 ? (
            <p>Nicio alerta.</p>
          ) : (
            <ul style={{ paddingLeft: 18 }}>
              {alerts.map((a) => (
                <li key={a.id}>
                  <b>{a.productName}</b> — exp: {a.expiryDate}
                </li>
              ))}
            </ul>
          )}

          <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
            <button className="btn" type="button" onClick={loadAll}>
              Refresh
            </button>
            <button className="btn" type="button" onClick={loadRecipes}>
              Sugereaza retete
            </button>
          </div>

          {recipesLoading && <p style={{ marginTop: 10 }}>Loading recipes...</p>}

          {recipes.length > 0 && (
            <div className="recipeGrid">
              {recipes.map((r) => (
                <a
                  key={r.idMeal}
                  className="recipeLink"
                  href={`https://www.themealdb.com/meal/${r.idMeal}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <b>{r.strMeal}</b>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ITEMS LIST */}
      <div className="card itemsWrap" style={{ marginTop: 24 }}>
        <h3>Alimentele mele</h3>

        {items.length === 0 ? (
          <p>Nu ai alimente.</p>
        ) : (
          <div style={{ display: "grid", gap: 10 }}>
            {items.map((it) => {
              const isClaimed = it.claim !== null && it.claim !== undefined;
              const canShare = it.availability === true && !isClaimed;

              return (
                <div className="itemRow" key={it.id}>
                  <div>
                    <div className="itemTitle">
                      {it.productName}{" "}
                      <span style={{ fontWeight: 400 }}>({it.category})</span>
                    </div>
                    <div className="itemMeta">
                      exp: {it.expiryDate} | availability: {String(it.availability)} | claim:{" "}
                      {String(it.claim)}
                    </div>
                  </div>

                  <div className="actions">
                    <button className="btn" onClick={() => onDelete(it.id)}>
                      Delete
                    </button>

                    {!it.availability && (
                      <button className="btn" onClick={() => onMakeAvailable(it.id)}>
                        Make available
                      </button>
                    )}

                    {canShare && (
                      <button className="btn" onClick={() => shareItem(it)}>
                        Share
                      </button>
                    )}

                    {isClaimed && (
                      <span style={{ opacity: 0.8, alignSelf: "center" }}>Claimed</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}