/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('T_Link_New', {
    linkId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    url: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    parentLinkId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    icon_class: {
      type: DataTypes.STRING(50),
      allowNull: true
    }
  }, {
    tableName: 'T_Link_New'
  });
};
