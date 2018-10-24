/**
 * 后台链接服务类
 */

var connection = require('../common/db');
const db = new connection('express');

//引用实体模型
var Link = require("../models/express/T_Link_New.js");

//实例数据访问层
var link = new Link(db, db.Sequelize);

/**
 * 获取所有的链接
 * @param {function} callback 回调方法
 */
exports.findAll = (callback) => {
    link.findAll().then(
        result => {
            callback(result)
        }
    );
}


/**
 * 获取带角色的链接地址
 * @param {function} callback 回调方法
 */
exports.findRoleAll = (callback) => {
    // db.query('SELECT a.*,b.`roleId` FROM t_link  AS a  LEFT JOIN t_role_link  AS b ON a.`linkId`=b.`linkId`').spread(
    //     function (results, metadata) {
    //         callback(results);
    //     });
}