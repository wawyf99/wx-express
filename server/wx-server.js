const connection = require('../common/db');
db = new connection('wx');
const redisController = require('../common/redis');

//获取微信公众号列表
exports.wxList = (keywords, sorts, status, callback) => {
    let sql = '';
    let _sql = 'WHERE 1 = 1';
    let _sql1 = 'BY id ASC';
    if(keywords){
        if(keywords.length == '18'){
            _sql += " AND app_id LIKE '%"+keywords+"%' OR authorizer_app_id LIKE  '%"+keywords+"%'";
        }else {
            _sql += " AND title LIKE '%"+keywords+"%'";
        }
    }
    if(status){
        _sql += " AND status = "+status;
    };

    if(sorts == 2){
        _sql1 = 'BY create_time ASC';
    }else if(sorts == 3){
        _sql1 = 'BY create_time DESC';
    }
    sql = "SELECT * FROM wx.T_Wx " + _sql + " ORDER " + _sql1;

    db.query(sql, {
        replacements: []
    }).spread((results) => {
        callback(results);
    });
};

//新增公众号
exports.wxAdd = (item, id, callback) => {
    if(id){
        db.query("UPDATE `wx`.`T_Wx` SET `title` = ?, `app_id` = ?, `app_secret` = ?, `token` = ?, `key` = ?, `redirect_url` = ?, `authorizer_app_id` = ? WHERE `id` = ?", {
            replacements: [item.title, item.app_id, item.app_secret, item.token, item.key, item.redirect_url, item.authorizer_app_id, id],
        }).spread((res) => {
            let result = {};
            result.status = true;
            result.msg = '更新成功';
            result.data = res;
            callback(result);
        });
    }else{
        db.query("SELECT * FROM wx.T_Wx WHERE app_id = ? OR authorizer_app_id = ?", {
            replacements: [item.app_id, item.authorizer_app_id]
        }).spread((results) => {
            let result = {};
            if(results.length > 0){
                result.status = false;
                result.msg = '该公众号已存在';
                result.data = '';
                callback(result);
            }else{
                db.query("INSERT INTO wx.`T_Wx`(`title`, `app_id`, `app_secret`, `token`, `key`, `redirect_url`, `authorizer_app_id`, `create_time`, `status`) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), 1)", {
                    replacements: [item.title, item.app_id, item.app_secret, item.token, item.key, item.redirect_url, item.authorizer_app_id],
                }).spread((res) => {
                    result.status = true;
                    result.msg = '新增成功';
                    result.data = '';
                    callback(result);
                });
            }
        });
    }
};

//获取单条记录
exports.wxGetOne = (id, callback) => {
    db.query("SELECT * FROM wx.T_Wx WHERE `id` = ?", {
        replacements: [id]
    }).spread((results) => {
        let result = {};
        if(results){
            result.status = true;
            result.msg = '';
            result.data = results;
            callback(result);
        }
    });
};

//删除
exports.wxDel = (id, callback) => {
    db.query("DELETE FROM wx.T_Wx WHERE `id` = ?", {
        replacements: [id]
    }).spread((results) => {
        let result = {};
        if(results){
            result.status = true;
            result.msg = '删除成功';
            result.data = results;
            callback(result);
        }
    });
};

//修改状态
exports.wxOperation = (id, status, callback) => {
    db.query("UPDATE `wx`.`T_Wx` SET `status` = ? WHERE `id` = ?", {
        replacements: [status, id]
    }).spread((results) => {
        let result = {};
        if(results.affectedRows > 0){
            result.status = true;
            result.msg = '更新成功';
            result.data = '';
            callback(result);
        }else{
            result.status = false;
            result.msg = '请勿重复操作';
            result.data = '';
            callback(result);
        }
    });
};

//获取公众号列表
exports.wechatList = (keywords, sorts, status, callback) => {
    redisController.redisController.updateWechat();
    let sql = '';
    let _sql = 'WHERE 1 = 1';
    let _sql1 = 'BY status DESC';
    if(keywords){
        if(keywords.length == '18'){
            _sql += " AND app_id LIKE '%"+keywords+"%'";
        }else {
            _sql += " AND app_secret LIKE '%"+keywords+"%'";
        }
    }
    if(status){
        _sql += " AND status = "+status;
    };

    if(sorts == 2){
        _sql1 = 'BY create_time ASC';
    }else if(sorts == 3){
        _sql1 = 'BY create_time DESC';
    }
    sql = "SELECT * FROM wx.T_Wx_Wechat " + _sql + " ORDER " + _sql1;

    db.query(sql, {
        replacements: []
    }).spread((results) => {
        callback(results);
    });
};

//禁封公众号
exports.wechatDel = (id, callback) => {
    db.query("UPDATE `wx`.`T_Wx_Wechat` SET `status` = 1, `close_time` = NOW()  WHERE `id` = ?", {
        replacements: [id]
    }).spread((results) => {
        let result = {};
        if(results.affectedRows > 0){
            result.status = true;
            result.msg = '禁封成功';
            result.data = '';
            redisController.redisController.updateWechat();
            callback(result);
        }else{
            result.status = false;
            result.msg = '请勿重复操作';
            result.data = '';
            callback(result);
        }
    });
};

//更改状态
exports.wechatOperation = (id, status, callback) => {
    if(status == '2'){
        db.query("UPDATE `wx`.`T_Wx_Wechat` SET `status` = ? WHERE `id` = ?", {
            replacements: [status, id]
        }).spread((results) => {
            let result = {};
            if(results.affectedRows > 0){
                redisController.redisController.updateWechat();
                result.status = true;
                result.msg = '候选成功';
                result.data = '';
                callback(result);
            }else{
                result.status = false;
                result.msg = '请勿重复操作';
                result.data = '';
                callback(result);
            }
        });
    }else{
        db.query("SELECT * FROM wx.T_Wx_Wechat WHERE `status` = ?", {
            replacements: [status]
        }).spread((results) => {
            let result = {};
            if(results.length > 0){
                result.status = false;
                result.msg = '当前已有正在使用的公众号';
                result.data = '';
                callback(result);
            }else{
                db.query("UPDATE `wx`.`T_Wx_Wechat` SET `status` = ? WHERE `id` = ?", {
                    replacements: [status, id],
                }).spread((res) => {
                    redisController.redisController.updateWechat();
                    result.status = true;
                    result.msg = '选用成功';
                    result.data = '';
                    callback(result);
                });
            }
        });
    }

};

//新增公众号
exports.wechatAdd = (app_id, app_secret, id, callback) => {
    if(id){
        db.query("UPDATE `wx`.`T_Wx_Wechat` SET `app_id` = ?, `app_secret` = ?  WHERE `id` = ?", {
            replacements: [app_id, app_secret, id],
        }).spread((res) => {
            redisController.redisController.updateWechat();
            let result = {};
            result.status = true;
            result.msg = '更新成功';
            result.data = res;
            callback(result);
        });
    }else{
        db.query("SELECT * FROM wx.T_Wx_Wechat WHERE app_id = ?", {
            replacements: [app_id]
        }).spread((results) => {
            let result = {};
            if(results.length > 0){
                result.status = false;
                result.msg = '该公众号已存在';
                result.data = '';
                callback(result);
            }else{
                db.query("INSERT INTO wx.`T_Wx_Wechat`(`app_id`, `app_secret`, `create_time`, `status`) VALUES (?, ?, NOW(), 2)", {
                    replacements: [app_id, app_secret],
                }).spread((res) => {
                    redisController.redisController.updateWechat();
                    result.status = true;
                    result.msg = '新增成功';
                    result.data = '';
                    callback(result);
                });
            }
        });
    }
};

//获取单条记录
exports.wechatGetOne = (id, callback) => {
    db.query("SELECT * FROM wx.T_Wx_Wechat WHERE `id` = ?", {
        replacements: [id]
    }).spread((results) => {
        let result = {};
        if(results){
            result.status = true;
            result.msg = '';
            result.data = results;
            callback(result);
        }
    });
};

//设置公众号接入方式
exports.conect = (callback) => {
    redisController.redisController.setConect().then(res => {
        let result = {};
        result.status = true;
        result.data = 'ok';
        callback(result)
    });
};

//获取公众号接入方式
exports.getConect = (callback) => {
    redisController.redisController.getConect().then(res => {
        let result = {};
        result.status = true;
        result.data = res.data;
        callback(result)
    });
};


