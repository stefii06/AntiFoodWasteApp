const { User } = require('../models');

// Inregistrare user nou
exports.register = async (req, res) => {
    try {
        const { username, email, password, tag } = req.body;
        const newUser = await User.create({ username, email, password, tag });
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

//Login simplu( doar  cu o verificare de baza)
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email, password } });
        
        if (user) {
            res.status(200).json({ message: "Login reusit!", user });
        } else {
            res.status(401).json({ error: "Email sau parola incorecta" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Vezi Profilul si Taguri
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ error: "User-ul nu a fost gasit" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// lista tuturor userilor (fără parola)
exports.listUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "username", "email", "tag"],
    });
    res.json(users);
  } catch (error) {
    console.error("listUsers error:", error);
    res.status(500).json({ error: error.message });
  }
};