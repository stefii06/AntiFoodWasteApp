//Extragem obiectul DataTypes din pachetul Sequelize 
//prentu a mapa tipul de date in conformitate cu regulile bazei de date SQL
const {DataTypes}= require("sequelize");

module.exports = (sequelize)=>{

  const User = sequelize.define('User',{

   //Definim o cheie primara
   id:{ 
    primaryKey: true,
    autoIncrement: true,

    type: DataTypes.INTEGER
   },

   //Definim username
   username:{
    type: DataTypes.STRING(100),
    allowNull: false
   },
   
   //Email si parola pentru autentificare si vizualizare doar  a alimentelor proprii
   email:
   { type: DataTypes.STRING(100),
     allowNull: false, 

     unique:true  //emailul trebuie sa fie unic pentru fiecare user
   },
   
   password:
   { type: DataTypes.STRING(256),
     allowNull: false
   },

   //Tag pentru a oferi functionalitate de grup de prieteni
   tag: {
     type: DataTypes.STRING(100),
     allowNull: true
   }

  },
  {
    timestamps:false
  }
)
  return User;
}





