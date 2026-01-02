/**
 * Modelul FoodItem - Gestioneaza inventarul de alimente si starea acestora.
 * Include logica pentru categorisire, alerte de expirare și sistemul de claim.
 */
const {DataTypes} = require("sequelize");

module.exports =(sequelize)=>{

const FoodItem = sequelize.define("FoodItem",{

id:{
    primaryKey: true,
    autoIncrement: true,

    type: DataTypes.INTEGER
},
productName:{
   type: DataTypes.STRING(100),
   allowNull: false
},
//Functionalitate: Lista organizata pe categorii
category:{
    type: DataTypes.STRING(100),
    allowNull: false
},
//Functionalitate: Ca utilizator primesc alerte cand un produs se apropie de termenul de valabilitate.
expiryDate:{
    type:DataTypes.DATEONLY, //// DATEONLY stochează YYYY-MM-DD, ideal pentru validarea termenului
    allowNull:false
},
//Functionalitate: Marchez produse disponibile
availability:{
    type:DataTypes.BOOLEAN,

    defaultValue: false // Produsul este privat (în frigider) pana la marcare
},
//Functionalitate: Poti face claim pe produs
claim:{
    type:DataTypes.INTEGER ,//Stocam ID-ul userului care a rezervat produsul
    allowNull: true
},
//Pentru a implementa relatia de one tomany dintre user si fooditem
userId:{
     type: DataTypes.INTEGER,
     allowNull:false
}

},
{timestamps:false});
return FoodItem;

}