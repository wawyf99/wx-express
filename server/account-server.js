var connection = require('../common/db');
const db = new connection('express');
//引用实体模型
var Accounts = require("../models/express/T_Account.js");
var AccountsLink = require("../models/express/T_Account_Link.js");

var Account = new Accounts(db, db.Sequelize);
var accountLinkServer = new AccountsLink(db, db.Sequelize);

/**
 * 添加用户
 * @param {object} obj 用户对象
 */
exports.addAccount = function (obj, callback) {
    Account.create({
        account: obj.account,
        password: obj.password,
        nickname: obj.nickname,
        disabled: false,
        roleId: obj.roleid,
        createtime: new Date().toLocaleString()
    }).then(result => {
        var o = [];
        var _arr = obj.link;
        _arr = _arr.replace(/\[|]/g,'');
        _arr = _arr.split(",");
        //对link集合转为数组遍历
        _arr.map((item) => {
            o.push({
                accountId: result.accountId,
                linkId: item
            });
        });
        accountLinkServer.bulkCreate(o).then(r => {
            callback(r);
        });
    });
};


/**
 * 获取用户权限
 * @param {number} accountId
 * @param {function} callback
 */
exports.getLink = (accountId, callback) => {
    if (accountId == 1) //超级管理员
    {
        db.query("  SELECT * FROM T_Link_New WHERE `show` = '1' ORDER BY sort ASC").spread(r => {
            callback(r);
        });
    } else {
        db.query(" SELECT b.* FROM T_Account_Link AS a\
        LEFT JOIN T_Link_New AS b ON a.linkId=b.`linkId`\
        WHERE a.`accountId`=? and a.show = 1 ORDER BY b.sort ASC", {
            replacements: [accountId],
        }).spread(r => {
            callback(r);
        });
    }
}

/**
 * 修改用户信息
 * @param {object} obj
 * @param {function} callback
 */
exports.update = (obj, callback) => {
    Account.update({
        account: obj.account,
        //password: obj.password,
        nickname: obj.nickname,
        roleId: obj.roleid,
    }, {
        where: {
            accountId: obj.accountId
        }
    }).then((r) => {
        //先删除后创建记录
        if (r != null) {
            accountLinkServer.destroy({
                where: {
                    accountId: obj.accountId
                }
            });
        }
        var o = [];
        var _arr = obj.link;
        _arr = _arr.replace(/\[|]/g,'');
        _arr = _arr.split(",");
        //对link集合转为数组遍历
        _arr.map((item) => {
            o.push({
                accountId: obj.accountId,
                linkId: item
            });
        });
        accountLinkServer.bulkCreate(o).then(r => {
            callback(r);
        });
    });
}

/**
 * 通过用户密码查询用户信息
 * @param {string} account 账号
 * @param {string} password 密码
 */
exports.find = function (account, password, callback) {
    Account.findOne({
        where: {
            account: account,
            password: password,
            disabled: false
        }
    }).then(result => {
        callback(result);
    });
};

/**
 * 验证账号是否存在
 * @param {string} account
 */
exports.exists = (account, callback) => {
    Account.findOne({
        where: {
            account: account,
            disabled: false
        }
    }).then(result => {
        callback(result);
    });
}

/**
 * 重置密码
 * @param {object} obj
 * @param {*} callback
 */
exports.restPassword = (obj, callback) => {
    Account.update({
        password: obj.password
    }, {
        where: {
            accountId: obj.accountId
        }
    }).then(result => {
        callback(result);
    });
}

/**
 * 修改密码
 * @param {object} obj 用户对象
 */
exports.updatePassword = (obj, callback) => {
    Account.find({
        where: {
            accountId: obj.accountId,
            password: obj.oldpwd
        }
    }).then(r => {
        if (r) {
            Account.update({
                password: obj.password
            }, {
                where: {
                    accountId: obj.accountId
                }
            }).then(result => {
                callback(result);
            });
        } else {
            callback(false);
        }
    });

}

/**
 * 禁用用户
 * @param {number} accountId 用户ID
 */
exports.disabled = (accountId, status, callback) => {
    Account.update({
        disabled: status
    }, {
        where: {
            accountId: accountId
        }
    }).then(result => {
        callback(result);
    });
}

/**
 * 根据用户ID获取用户信息
 * @param {number} accountId
 * @param {function} callback
 */
exports.getModel = (accountId, callback) => {
    db.query(' SELECT a.*,GROUP_CONCAT(b.`linkId`) AS link FROM T_Account AS a \
    LEFT JOIN T_Account_Link AS b ON a.`accountId`=b.accountId\
    WHERE a.`accountId`=?', {
        replacements: [accountId],
        type: db.QueryTypes.SELECT
    }).spread(r => {
        callback(r);
    });
}

/**
 * 获取用户列表
 */
exports.list = (role, value, callback) => {
    var conditions = [];
    var sql = "SELECT a.`accountId`,a.`account`,DATE_FORMAT(a.`createtime`, '%Y-%c-%d' ) createtime,a.`nickname`,a.`disabled`,b.`roleName`,GROUP_CONCAT(d.`name`) AS link FROM T_Account AS a\
    LEFT JOIN T_Role AS b ON a.`roleId`=b.`roleId`\
    LEFT JOIN T_Account_Link AS c ON a.`accountId`=c.`accountId`\
    LEFT JOIN T_Link_New AS d ON c.`linkId`=d.`linkId`\
    where a.account<>'dianhai' and disabled=false";
    if (role > 0) {
        sql += " and  a.roleId=" + role;
    }
    if (value) {
        sql += " and  (a.account like '%" + value + "%' or a.nickname like '%" + value + "%')";
    }
    sql += " GROUP BY a.`accountId`,a.`account`,a.`createtime`,a.`nickname`,a.`disabled`,b.`roleName` limit 1000";
    db.query(sql).spread(r => {
        callback(r);
    });
}