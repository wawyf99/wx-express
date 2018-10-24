/**
 * 角色服务类
 */

var connection = require('../common/db');
const db = new connection('express');

//引用实体模型
var Account = require("../models/express/T_Account.js");
var Roles = require("../models/express/T_Role.js");
var roleLinkServer = require("../server/roleLink-server");

var accountServer = new Account(db, db.Sequelize);
var role = new Roles(db, db.Sequelize);
/**
 * 添加用户
 * @param {object} obj 用户对象
 */
exports.addRole = function (name, arr, callback) {
    role.findOne({
        where: {
            roleName: name
        }
    }).then((r) => {
        //存在删除后创建
        if (r != null) {
            role.destroy({
                where: {
                    roleName: name
                }
            });
            roleLinkServer.delete(r.roleId);
        }
        let arrLink = JSON.parse(arr);
        //不存在创建
        role.create({
            roleName: name,
        }).then(result => {
            var obj = [];
            arrLink.map(item => {
                if (item != "" && item != undefined) {
                    obj.push({
                        roleId: result.roleId,
                        linkId: item
                    });
                }
            })
            roleLinkServer.addRoleLink(obj, r => {
                callback(r);
            });
        });
    });
};

/**
 * 删除角色
 * @param {function} callback 
 */
exports.delete = (roleId, callback) => {
    accountServer.findOne({
        where: {
            roleId: roleId,
            disabled: 0
        }
    }).then((result) => {
        if (result == null) {
            role.destroy({
                where: {
                    roleId: roleId
                }
            });
            roleLinkServer.delete(roleId, () => {
                callback(global.resResult('1', '', ''));
            });
        } else {
            callback(global.resResult('0', '0', '有用户使用改角色不能删除!'));
        }
    });
}

/**
 * 获取角色列表
 * @param {function} callback 
 */
exports.findAll = (callback) => {
    db.query('SELECT a.`roleId`,a.`roleName`,GROUP_CONCAT(c.`name`) AS linkname,GROUP_CONCAT(CAST(c.`linkId` AS CHAR)) AS linkid FROM T_Role AS a \
    LEFT JOIN T_Role_Link AS b ON a.`roleId`=b.`roleId`\
    LEFT JOIN T_Link_New AS c ON b.`linkId`=c.`linkId` GROUP BY a.`roleId`,a.`roleName`').spread((result) => {
        callback(result);
    });
}