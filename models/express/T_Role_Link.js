/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('T_Role_Link', {
    roleId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    linkId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    }
  }, {
    tableName: 'T_Role_Link'
  });
};
