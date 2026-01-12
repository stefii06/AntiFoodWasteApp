const express = require("express");
const axios = require("axios");
const router = express.Router();

console.log("✅ externalRoutes.js loaded");

router.get("/ping", (req, res) => {
  res.json({ ok: true, where: "externalRoutes" });
});

router.get("/recipes", async (req, res) => {
  try {
    const ingredient = req.query.ingredient;
    const r = await axios.get(
      `https://www.themealdb.com/api/json/v1/1/filter.php?i=${encodeURIComponent(ingredient)}`
    );
    res.json(r.data);
  } catch (e) {
    res.status(500).json({ message: "External API error" });
  }
});

module.exports = router;
