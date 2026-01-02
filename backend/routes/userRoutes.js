// Aici facem Login/Register si vedem Profilul
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Ruta pentru inregistrare
router.post('/register', userController.register);

// Ruta pentru login
router.post('/login', userController.login);

// Ruta pentru a vedea profilul si tag-urile (preferintele alimentare)
router.get('/:id', userController.getProfile);

module.exports = router;