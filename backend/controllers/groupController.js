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

// Vezi alimentele dintr-un grup (ale membrilor lui)
exports.getGroupFood = async (req, res) => {
  try {
    const { groupId } = req.params;

    const members = await UserGroup.findAll({ where: { groupId } });
    const memberIds = members.map((m) => m.userId);

    if (members.length === 0) {
      return res.status(200).json([]);
    }

    const groupFood = await FoodItem.findAll({
      where: { userId: memberIds },
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
          through: { attributes: [] }, // 👈 nu mai cerem label
        },
      ],
    });

    res.json(groups);
  } catch (error) {
    console.error("getUserGroups error:", error);
    res.status(500).json({ error: error.message });
  }
};
