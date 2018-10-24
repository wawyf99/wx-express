/**
 * 角色权限服务类
 */


var connection = require('../common/db');
const db = new connection('express');

//引用实体模型
var Roles = require("../models/express/T_Role_Link.js");

var role = new Roles(db, db.Sequelize);

/**
 * 添加角色权限
 * @param {array} obj 数组
 */
exports.addRoleLink = function (obj, callback) {
    role.bulkCreate(obj).then(r => {
        callback(r);
    });
};

/**
 * 添加角色权限
 * @param {number} obj 数组
 */
exports.delete = function (roleId, callback) {
    role.destroy({
        where: {
            roleId: roleId
        }
    }).then(r => {
        console.log(r);
        callback(r);
    });
};

/*
* 清空当前权限
* */
exports.deleteRoleLink = function (roleId) {
    role.destroy({
        where: {
            roleId: roleId
        }
    })
}