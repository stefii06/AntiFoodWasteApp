// User -> FoodItem (Proprietar)
User.hasMany(FoodItem, {
    foreignKey: 'id_proprietar',
    as: 'alimente',
});

// FoodItem -> User (Proprietar)
FoodItem.belongsTo(User, {
    foreignKey: 'id_proprietar',
    as: 'proprietar',
});

// User -> FriendGroup (Creator)
User.hasMany(FriendGroup, {
    foreignKey: 'id_proprietar',
    as: 'grupuriCreate',
});

// FriendGroup -> User (Creator)
FriendGroup.belongsTo(User, {
    foreignKey: 'id_proprietar',
    as: 'creator',
});

// User -> FriendGroup (Membru)
User.belongsToMany(FriendGroup, {
    through: UserGroup, // Specifică modelul de joncțiune
    foreignKey: 'id_utilizator',
    as: 'grupuriMembru',
});

// FriendGroup -> User (Membru)
FriendGroup.belongsToMany(User, {
    through: UserGroup, // Specifică modelul de joncțiune
    foreignKey: 'id_grup',
    as: 'membri',
});