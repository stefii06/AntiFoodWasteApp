const express = require("express");
const axios = require("axios");
const router = express.Router();

// 👇 importăm direct FoodItem din models/index.js
const { FoodItem } = require("../models");

console.log("✅ externalRoutes.js loaded");

// Test simplu
router.get("/ping", (req, res) => {
  res.json({ ok: true, where: "externalRoutes" });
});

// API-ul de rețete (ce aveai deja)
router.get("/recipes", async (req, res) => {
  try {
    const ingredient = req.query.ingredient;
    const r = await axios.get(
      `https://www.themealdb.com/api/json/v1/1/filter.php?i=${encodeURIComponent(
        ingredient
      )}`
    );
    res.json(r.data);
  } catch (e) {
    console.error("Eroare la API-ul extern de rețete:", e);
    res.status(500).json({ message: "External API error" });
  }
});

// 🔹 NOU: endpoint pentru generarea textului de share
router.get("/share/:foodId", async (req, res) => {
  try {
    const { foodId } = req.params;

    // folosim modelul corect: FoodItem
    const foodItem = await FoodItem.findByPk(foodId);

    if (!foodItem) {
      return res.status(404).json({ message: "Alimentul nu a fost găsit" });
    }

    // câmpurile corecte din modelul tău
    const name = foodItem.productName || "Produs disponibil";
    const expiresAt = foodItem.expiryDate || null;

    // momentan nu ai location în model → punem un text generic
    const location = "zona mea";

    // link spre frontend (îl schimbi când ai domeniu real)
    const appBaseUrl = "http://localhost:5173";
    const productUrl = `${appBaseUrl}/share/food/${foodItem.id}`;

    let message = `Am un produs disponibil: ${name}.`;
    if (expiresAt) message += ` Expiră pe ${expiresAt}.`;
    message += ` Dacă ești aproape de ${location}, scrie-mi!`;
    message += `\n\nVezi detalii aici: ${productUrl}`;

    const encodedUrl = encodeURIComponent(productUrl);
    const encodedMessage = encodeURIComponent(message);

    // linkul oficial de share Facebook (cu popup)
    const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedMessage}`;

    // Instagram nu are share cu text precompletat prin URL,
    // dar poți deschide aplicația web:
    const instagramUrl = "https://www.instagram.com/";

    return res.json({
      ok: true,
      foodId: foodItem.id,
      message,
      productUrl,
      fbShareUrl,
      instagramUrl
    });
    
  } catch (err) {
    console.error("Eroare la generarea mesajului de share:", err);
    // pentru debug e util să trimiți și err.message; poți să-l scoți mai târziu
    return res.status(500).json({
      message: "Eroare la generarea mesajului de share",
      error: err.message,
    });
  }
});

  

module.exports = router;
