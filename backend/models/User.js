const {DataTypes} = require('sequelize');

module.exports = (sequelize)=>{
const User = sequelize.define('User',{

    id: {
        type:DataTypes.UUID,
        defaultValue:DataTypes.UUIDV4,
        primaryKey:true,
    },
    nume:{
         type:DataTypes.STRING(100),
         allowNull: false,
    },
    email:{
         type:DataTypes.STRING(150),
         allowNull: false,
         unique:true,
         validate:{
            isEmail:true,
         },
    },
    parola_hash: {
        type:DataTypes.STRING(255),
        allowNull:false, //hashing inainte de salvare
    },
    locatie:{
        type: DataTypes.STRING(255),
        allowNull:true,
    },
},
//optiunile pentru sequelize
{
  tableName:'Users',
  timestamps:true, //adaugam createdAT si updatedAT in mod automat
});

//returnam modelul definit
return User;
}






