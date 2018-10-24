const
    connection = require('../common/db'),
    wechat = require('../common/wechat/wechat-util');
/**
 * 关注用户
 */
exports.subscribe = (openid, user) => {
    accountBindServer.find({
        where: {
            unionid: user.unionid
        }
    }).then(result => {
        var uid = 0;
        if (result) uid = result.uid;
        if (user) {
            var url = user.headimgurl.replace(/[\\]/g, '');
            db.query('call sp_account_logon_third_party(?,?,?,?,?,?,?,?,?,?,?)', {
                replacements: [1, 2, openid, user.unionid, user.nickname, url, user.sex, 1001, '1.0.0', uid, ''],
            }).spread(r => {});
        }
    })
};

/*
* 获取亲友圈信息
* 获取当前用户信息
* */
exports.getShareInfo = (accountId, clubId, openId, callback) => {
    db.query('CALL game.SP_Get_Share_Info(?,?,?)', {
        replacements: [accountId, clubId, openId],
    }).spread((results, metadata) => {
        callback(results);
    });
};

/**
 * 根据openid获取用户信息
 * @param {string} openId
 */
exports.findByOpenId = (openId, callback) => {
    db.query("SELECT a.* FROM `account` AS a LEFT JOIN `account_bind` AS b ON a.uid=b.`uid`  WHERE b.`unionid`=?", {
        replacements: [openId],
        type: db.QueryTypes.SELECT
    }).spread(result => {
        callback(result);
    })
}