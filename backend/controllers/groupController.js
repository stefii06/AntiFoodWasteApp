const { FriendGroup, UserGroup, FoodItem, User } = require('../models');

// Creeaza grupul
exports.createGroup = async (req, res) => {
    try {
        const { groupName } = req.body;
        const group = await FriendGroup.create({ groupName });
        res.status(201).json(group);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Adauga un user in grup (invite)
exports.addUserToGroup = async (req, res) => {
    try {
        const { userId, groupId } = req.body;
        const entry = await UserGroup.create({ userId, groupId });
        res.status(201).json({ message: "Utilizator adaugat in grup!", entry });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Vezi alimentele marcate ca "available" din grupul din care face parte userul
exports.getGroupFood = async (req, res) => {
    try {
        const { groupId } = req.params;
        
        //Gasim membrii grupului
        const members = await UserGroup.findAll({ where: { groupId } });
        const memberIds = members.map(m => m.userId);
          
        if (members.length === 0) {
    return res.status(200).json([]); //Returnam lista goala daca grupul nu are membri
        }
        //Gasim alimentele lor disponibile
        const groupFood = await FoodItem.findAll({
            where: {
                userId: memberIds,
                availability: true
            },
            // Specificam as: 'proprietar'pt ca am folosit alias in index.js
            //Fara  un nume specific în index.js, Sequelize folosește numele modelului.
            
            include: [{ 
                model: User, 
                as: 'proprietar',
                attributes: ['username', 'tag'] ,
                required: false // Ajuta la evitarea erorilor de tip "Empty Join"
            }]
        });

        res.status(200).json(groupFood);
    } catch (error) {
       
        res.status(500).json({ error: error.message });
        console.log("Eroare detaliata Sequelize:", err.parent); // Asta ne va spune exact ce SQL a crapat
    }};

    exports.getUserGroups = async (req, res) => {
  try {
    const { userId } = req.params;

    // mai întâi aflăm în ce grupuri e userul
    const memberships = await UserGroup.findAll({
      where: { userId },
      attributes: ["groupId"],
    });

    const groupIds = memberships.map((m) => m.groupId);

    if (!groupIds.length) {
      return res.json([]); // userul nu e în niciun grup
    }

    // luăm grupurile + toți membrii lor (User)
    const groups = await FriendGroup.findAll({
      where: { id: groupIds },
      include: [
        {
          model: User,
          attributes: ["id", "username", "tag"],
          through: { attributes: [] }, // nu vrem coloanele intermediare
        },
      ],
    });

    res.json(groups);
  } catch (err) {
    console.error("getUserGroups error:", err);
    res.status(500).json({ error: err.message });
  }
};