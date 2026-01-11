const { Sequelize } = require("sequelize");

// Conexiunea la baza de date
let sequelize;

if (process.env.DATABASE_URL) {
  // Railway Postgres (deploy)
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    logging: false,
  });
} else {
  // Local MySQL (XAMPP)
  sequelize = new Sequelize("AntiFoodWasteApp", "root", "parola", {
    host: "localhost",
    dialect: "mysql",
    logging: false,
  });
}

//Importam modelele si le transmitem instanta sequelize--------------------------
const User = require('./User')(sequelize);
const FoodItem = require('./FoodItem')(sequelize);
const FriendGroup = require('./FriendGroup')(sequelize);
const UserGroup = require('./UserGroup')(sequelize);


//Relatiile dintre modele-------------------------------------------------------
//Relatie de ownership, pot sa creez o lista cu alimente
//User.id <-> FoodItem.userId
User.hasMany(FoodItem, { 
    foreignKey: 'userId', 
    as: 'alimente' 
});

FoodItem.belongsTo(User, { 
    foreignKey: 'userId', 
    as: 'proprietar' 
});

//Relatie de claim pe produs, pentru a tine cont de cine a rezervat produse
//User.id <-> FoodItem.claim
User.hasMany(FoodItem, { 
    foreignKey: 'claim', 
    as: 'rezervari' 
});

FoodItem.belongsTo(User, { 
    foreignKey: 'claim', 
    as: 'claimer' 
});



//Relatie de definire a grupului de prieteni(Many to Many, corectata prin tabela de jonctiune UserGroup)
User.belongsToMany(FriendGroup, { 
    through: UserGroup, 
    foreignKey: 'userId', 
    otherKey: 'groupId' 
});

FriendGroup.belongsToMany(User, { 
    through: UserGroup, 
    foreignKey: 'groupId', 
    otherKey: 'userId' 
});

// Relatie de ownership pentru grup (Cine a creat grupul)
User.hasMany(FriendGroup, { foreignKey: 'creatorId' });
FriendGroup.belongsTo(User, { foreignKey: 'creatorId', as: 'creator' });
//-----------------------------------------------------------------
module.exports = {
    sequelize,
    User,
    FoodItem,
    FriendGroup,
    UserGroup
};