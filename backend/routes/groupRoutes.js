//Aici facem crearea de grupui si adaugarea prietenilor intr-un grup specific prin intermediul tagului de membru
const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');

// Creare grup nou (ex: "Familia")
router.post('/create', groupController.createGroup);

// Adaugare membru in grup (pentru a invita prietenii)
router.post('/addUser', groupController.addUserToGroup);

// Vezi toate alimentele disponibile din grupul in care apartine userul
router.get('/:groupId/available-food', groupController.getGroupFood);


module.exports = router;