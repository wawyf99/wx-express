const connection = require('../common/db');
db = new connection('express');
/**
 * 获取配置
 */
exports.getWxConfig = (id, callback) => {
    console.log(id);
    db.query("SELECT * FROM express.T_Wx WHERE id = ?", {
        replacements: [id]
    }).spread((results) => {
        let result = {};
        if(results){
            result.status = true;
            result.data = results[0];
            callback(result);
        }
    });
};

//获取公众号关联的ID
exports.getWxId = (appid, callback) => {
    db.query("SELECT * FROM express.T_Wx WHERE app_id = ?", {
        replacements: [appid]
    }).spread((results) => {
        let result = {};
        if(results){
            result.status = true;
            result.data = results[0];
            callback(result);
        }
    });
};
