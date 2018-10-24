const connection = require('../common/db'),
db = new connection('express');


//获取群聊信息
exports.getTitle = (callback) => {
    db.query("SELECT * FROM express.T_Chart_Info ORDER BY RAND() LIMIT 1", {
        replacements: [],
        type: db.QueryTypes.SELECT
    }).spread((results) => {
        callback(results);
    });
};

//管理群聊信息
exports.manageTitle = (keywords, callback) => {
    let _sql = '';
    if(keywords){
        _sql = "SELECT * FROM express.T_Chart_Info WHERE title LIKE '%"+keywords+"%' ORDER BY id ASC";
    }else{
        _sql = "SELECT * FROM express.T_Chart_Info ORDER BY id ASC";
    }
    db.query(_sql, {
        replacements: [keywords],
    }).spread((results) => {
        //callback(results);
        let result = [];
        for (key in results) {
            if (results.hasOwnProperty(key)) {
                result.push(results[key]);
            }
        }
        callback(result);
    });
};

//删除内容&更新内容
exports.deleteTitle = (id, callback) => {

    db.query("DELETE FROM `express`.`T_Chart_Info` WHERE `id` = ?", {
        replacements: [id]
    }).spread((results) => {
        let result = {};
        if(results.affectedRows > 0){
            result.status = true;
            result.msg = '删除成功';
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

//获取单条内容
exports.getTitles = (id, callback) => {
    db.query("SELECT * FROM express.T_Chart_Info WHERE id = ?", {
        replacements: [id],
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

//新增内容
exports.addTitle = (title, img, enrollment, invitor, id, callback) => {
    if(id){
        db.query("UPDATE `express`.`T_Chart_Info` SET `title` = ?, `img` = ?, `enrollment` = ?, `invitor` = ? WHERE `id` = ?", {
            replacements: [title, img, enrollment, invitor, id],
        }).spread((res) => {
            let result = {};
            result.status = true;
            result.msg = '更新成功';
            result.data = res;
            callback(result);
        });
    }else{
        db.query("SELECT * FROM express.T_Chart_Info WHERE title = ?", {
            replacements: [title]
        }).spread((results) => {
            let result = {};
            if(results.length > 0){
                result.status = false;
                result.msg = '该名称已存在';
                result.data = '';
                callback(result);
            }else{
                db.query("INSERT INTO `express`.`T_Chart_Info`(`title`, `img`, `enrollment`, `invitor`) VALUES (?, ?, ?, ?)", {
                    replacements: [title, img, enrollment, invitor],
                }).spread((res) => {
                    result.status = true;
                    result.msg = '新增成功';
                    result.data = res;
                    callback(result);
                });
            }
        });
    }
};

