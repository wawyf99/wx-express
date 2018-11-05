/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('T_Role', {
    roleId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    roleName: {
      type: DataTypes.STRING(20),
      allowNull: true
    }
  }, {
    tableName: 'T_Role'
  });
};
