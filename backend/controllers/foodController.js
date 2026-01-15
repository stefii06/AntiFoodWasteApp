// controllers/foodController.js
const { FoodItem } = require("../models");
const { Op } = require("sequelize");

// 1. Vezi alimentele unui utilizator
exports.getUsersFoodItems = async (req, res) => {
  try {
    const items = await FoodItem.findAll({
      where: { userId: req.params.userId },
    });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 2. Adaugă un aliment nou
exports.addFoodItem = async (req, res) => {
  try {
    const { productName, category, expiryDate, userId } = req.body;
    const newItem = await FoodItem.create({
      productName,
      category,
      expiryDate,
      userId,
    });
    res.status(201).json(newItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 3. Șterge un aliment
exports.deleteFoodItem = async (req, res) => {
  try {
    const deleted = await FoodItem.destroy({
      where: { id: req.params.id },
    });
    if (deleted) {
      res.status(200).json({ message: "Aliment șters cu succes." });
    } else {
      res.status(404).json({ message: "Alimentul nu a fost găsit." });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 4. Marchează ca disponibil (one-way, dacă vrei să o mai folosești)
exports.makeAvailableFoodItem = async (req, res) => {
  try {
    const item = await FoodItem.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: "Produs negăsit." });

    await item.update({ availability: true, claim: null });

    res.status(200).json({ message: "Produsul este acum public!", item });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 4'. TOGGLE disponibil / indisponibil (folosit în Dashboard)
exports.toggleFoodAvailability = async (req, res) => {
  try {
    const item = await FoodItem.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: "Produs negăsit." });

    // dacă e deja rezervat, nu-l mai lăsăm să fie modificat
    if (item.claim != null) {
      return res
        .status(400)
        .json({ message: "Produsul este deja rezervat și nu poate fi modificat." });
    }

    const newAvailability = !item.availability;
    await item.update({ availability: newAvailability });

    res.status(200).json({
      message: `Produsul este acum ${
        newAvailability ? "disponibil" : "indisponibil"
      }.`,
      item,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 5. Claim pe un aliment
exports.claimFoodItem = async (req, res) => {
  try {
    const { claimerId } = req.body;
    const item = await FoodItem.findByPk(req.params.id);

    if (!item || !item.availability) {
      return res
        .status(400)
        .json({ message: "Produsul nu este disponibil pentru claim." });
    }

    await item.update({ claim: claimerId, availability: false });

    res
      .status(200)
      .json({ message: "Ai rezervat produsul cu succes!", item });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 6. Alerte expirare (în următoarele 7 zile)
exports.getFoodAlerts = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    const limitDate = nextWeek.toISOString().split("T")[0];

    const items = await FoodItem.findAll({
      where: {
        userId: req.params.userId,
        expiryDate: {
          [Op.between]: [today, limitDate],
        },
      },
    });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
