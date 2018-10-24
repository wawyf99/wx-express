/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('T_Account', {
    accountId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    roleId: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    account: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    password: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    nickname: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    disabled: {
      type: DataTypes.INTEGER(1),
      allowNull: false
    },
    createtime: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    tableName: 'T_Account'
  });
};
