import { useState } from "react";
import * as api from "../api/client";
import "./Recipes.css";

export default function Recipes() {
  const [ingredient, setIngredient] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function onSearch(e) {
    e.preventDefault();
    setErr("");

    const trimmed = ingredient.trim();
    if (!trimmed) {
      setErr("Introdu un ingredient (ex: chicken, tomato, egg).");
      return;
    }

    setLoading(true);
    try {
      const data = await api.get(`/external/recipes?ingredient=${encodeURIComponent(trimmed)}`);
      setRecipes(data?.meals || []);
    } catch (e) {
      setErr(e.message || "Nu s-au putut încărca rețetele.");
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="recipes">
      <h2>Rețete (Serviciu extern)</h2>
      <p className="recipes-subtitle">
        Caută idei de rețete folosind ingredientele disponibile — datele sunt preluate prin backend-ul
        Railway (API extern: TheMealDB).
      </p>

      {err && <p className="error">{err}</p>}

      <form onSubmit={onSearch} className="recipes-form">
        <input
          className="input"
          value={ingredient}
          onChange={(e) => setIngredient(e.target.value)}
          placeholder="Introdu un ingredient (ex: chicken)"
        />
        <button className="btn" disabled={loading}>
          {loading ? "Caut..." : "Caută"}
        </button>
      </form>

      <div className="card" style={{ marginTop: 24 }}>
        <h3>Rezultate</h3>

        {loading && <p>Se încarcă...</p>}

        {!loading && recipes.length === 0 && !err && (
          <p>Nicio rețetă găsită. Încearcă un alt ingredient.</p>
        )}

        <div className="recipeGrid">
          {recipes.map((r) => (
            <a
              key={r.idMeal}
              className="recipeLink"
              href={`https://www.themealdb.com/meal/${r.idMeal}`}
              target="_blank"
              rel="noreferrer"
            >
              <img src={r.strMealThumb} alt={r.strMeal} className="recipeImg" />
              <div className="recipeName">{r.strMeal}</div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
