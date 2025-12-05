// models/UserGroup.js (Tabel de Joncțiune)
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const UserGroup = sequelize.define('UserGroup', {
        // Nu este nevoie de un ID propriu, cheia primară compusa este suficienta

        id_utilizator: {
            type: DataTypes.UUID,
            references: {
                model: 'Users', // Referinta la tabelul User
                key: 'id',
            },
            primaryKey: true, // apartine cheii primare compuse
        },
        id_grup: {
            type: DataTypes.UUID,
            references: {
                model: 'FriendGroups', // Referinta la tabelul FriendGroup
                key: 'id',
            },
            primaryKey: true, // Face parte din cheia primara compusa
        },
    }, {
        tableName: 'UserGroup',
        timestamps: false, // Nu avem nevoie de timestamps pe un tabel de joncțiune simplu
    });

    return UserGroup;
};