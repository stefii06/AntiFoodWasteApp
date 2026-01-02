//Model de jonctiune: Leaga userii de grupuri si stocheaza eticheta

const {DataTypes}= require("sequelize");
module.exports = (sequelize) => {
  const UserGroup = sequelize.define("UserGroup", {
    // Tag-ul specific membrului in acest grup (ex: "iubitor de zacusca")
    memberTag: 
    { type: DataTypes.STRING(100),
         allowNull: true }
  }, 
  { timestamps: false });
  
  return UserGroup;
};