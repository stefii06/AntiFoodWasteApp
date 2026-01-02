
//Acest model defineste grupul în sine (ex: "Familia", "Colegii de camin")
const{DataTypes} = require("sequelize");

module.exports = (sequelize)=>{
    const FriendGroup =sequelize.define("FriendGroup",{
    id: {
        primaryKey: true,
        autoIncrement:true,

        type: DataTypes.INTEGER,
      
    },
    groupName:{
        type: DataTypes.STRING(150),
        allowNull:false
    }},
    {timestamps:false});
    
    return FriendGroup;
};