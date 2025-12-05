const {DataTypes} = require('sequelize');

module.exports = (sequelize)=>{
const FoodItem = sequelize.define('FoodItem',{

    id: {
        type:DataTypes.UUID,
        defaultValue:DataTypes.UUIDV4,
        primaryKey:true,
    },
    nume_produs:{
         type:DataTypes.STRING(150),
         allowNull: false,
    },
     categorie:{
         type:DataTypes.STRING(100),
         allowNull: false,
    },
    data_expirarii:{
         type:DataTypes.DATEONLY,
         allowNull: false,
    },
    cantitate: {
        type:DataTypes.NUMERIC,
        allowNull:false, 
    },
     descriere:{
         type:DataTypes.TEXT,
         allowNull: true,
    },
    disponibil:{
        type: DataTypes.BOOLEAN,
        allowNull:false,
    },
     id_proprietar:{
        type: DataTypes.UUID,
        allowNull:false,
    },
    data_adaugare:{
        type: DataTypes.DATE,
        allowNull:false,
    },
},
//optiunile pentru sequelize
{
  tableName:'FoodItems',
  timestamps:true, //pt a avea createdAt si updatedAt( utile pt debugging)
  createdAt:'data_adaugare' ,//mapam createdAt la campul din tabela
  updatedAt:'data_actualizare',
});

//returnam modelul definit
return FoodItem;
}






