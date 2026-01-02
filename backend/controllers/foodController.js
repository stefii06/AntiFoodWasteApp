//Interactionam cu modelul Sequelize pentru a implementa logica de business si a gestiona cererile primite in route

const { FoodItem } = require('../models');
const { Op } = require('sequelize'); //operatori sequelize

// 1.Vezi alimentele unui utilizator
exports.getUsersFoodItems = async (req, res) => {
    try {
        const items = await FoodItem.findAll({
            where: { userId: req.params.userId }
        });
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 2 Adauga un aliment nou
exports.addFoodItem = async (req, res) => {
    try {
        const { productName, category, expiryDate, userId } = req.body;
        const newItem = await FoodItem.create({
            productName,
            category,
            expiryDate,
            userId
        });
        res.status(201).json(newItem);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// 3.Sterge un aliment
exports.deleteFoodItem = async (req, res) => {
    try {
        const deleted = await FoodItem.destroy({
            where: { id: req.params.id }
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

// 4. Marcare ca disponibil (pentru share)
exports.makeAvailableFoodItem = async (req, res) => {
    try {
        const item = await FoodItem.findByPk(req.params.id);
        if (!item) return res.status(404).json({ message: "Produs negăsit." });

        await item.update({ availability: true });
        res.status(200).json({ message: "Produsul este acum public!", item });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 5.Claim pe un aliment
exports.claimFoodItem = async (req, res) => {
    try {
        const { claimerId } = req.body; // ID-ul userului care rezervă
        const item = await FoodItem.findByPk(req.params.id);

        if (!item || !item.availability) {
            return res.status(400).json({ message: "Produsul nu este disponibil pentru claim." });
        }

        //Se marchează claimer-ul și se scoate de la disponibil
        await item.update({ claim: claimerId, availability: false });
        res.status(200).json({ message: "Ai rezervat produsul cu succes!", item });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//6.Logica de Alerte atunci cand un produs se apropie de data de expirare


exports.getFoodAlerts = async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        const limitDate = nextWeek.toISOString().split('T')[0];

        const items = await FoodItem.findAll({
            where: {
                userId: req.params.userId,
                expiryDate: {
                    [Op.between]: [today, limitDate]
                }
            }
        });
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};