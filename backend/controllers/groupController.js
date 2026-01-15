const { FriendGroup, UserGroup, FoodItem, User } = require("../models");

// Creeaza grupul
exports.createGroup = async (req, res) => {
  try {
    const { groupName, creatorId } = req.body;
    const group = await FriendGroup.create({ groupName, creatorId });
    res.status(201).json(group);
  } catch (error) {
    console.error("createGroup error:", error);
    res.status(400).json({ error: error.message });
  }
};

// Adauga un user in grup (invite)
exports.addUserToGroup = async (req, res) => {
  try {
    const { userId, groupId } = req.body;

    const entry = await UserGroup.create({
      userId,
      groupId,
    });

    res
      .status(201)
      .json({ message: "Utilizator adaugat in grup!", entry });
  } catch (error) {
    console.error("addUserToGroup error:", error);
    res.status(400).json({ error: error.message });
  }
};

// Vezi alimentele relevante pentru grupuri
// 🔹 Acum întoarcem TOATE alimentele din aplicație, nu doar ale membrilor grupului.
// 🔹 Frontend-ul va decide:
//    - ce e "disponibil"  -> availability === true && claim == null
//    - ce e "rezervat în acest grup" -> claim făcut de un membru al grupului curent
exports.getGroupFood = async (_req, res) => {
  try {
    const groupFood = await FoodItem.findAll({
      include: [
        {
          model: User,
          as: "proprietar",
          attributes: ["id", "username", "tag"],
        },
        {
          model: User,
          as: "claimer",
          attributes: ["id", "username", "tag"],
          required: false,
        },
      ],
      order: [["expiryDate", "ASC"]],
    });

    res.status(200).json(groupFood);
  } catch (error) {
    console.error("getGroupFood error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Grupele unui user + membrii lor
exports.getUserGroups = async (req, res) => {
  try {
    const { userId } = req.params;

    const memberships = await UserGroup.findAll({
      where: { userId },
      attributes: ["groupId"],
    });

    const groupIds = memberships.map((m) => m.groupId);

    if (!groupIds.length) {
      return res.json([]);
    }

    const groups = await FriendGroup.findAll({
      where: { id: groupIds },
      include: [
        {
          model: User,
          attributes: ["id", "username", "tag"],
          through: { attributes: [] }, // nu ne trebuie coloane din tabela de legătură
        },
      ],
    });

    res.json(groups);
  } catch (error) {
    console.error("getUserGroups error:", error);
    res.status(500).json({ error: error.message });
  }
};
