const {DataTypes} = require('sequelize');

module.exports = (sequelize)=>{
const FriendGroup = sequelize.define('FriendGroup',{

    id: {
        type:DataTypes.UUID,
        defaultValue:DataTypes.UUIDV4,
        primaryKey:true,
    },
    nume_grup:{
         type:DataTypes.STRING(100),
         allowNull: false,
    },
    id_proprietar:{
         type:DataTypes.UUID,
         allowNull: false,
         
    },
    
},
//optiunile pentru sequelize
{
  tableName:'FriendGroups',
  timestamps:true, //adaugam createdAT si updatedAT in mod automat
});

//returnam modelul definit
return FriendGroup;
}






