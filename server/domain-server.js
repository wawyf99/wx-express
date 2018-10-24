const connection = require('../common/db');
db = new connection('express');
const redisController = require('../common/redis');



//定时任务
exports.domainTimer = (timer, callback) => {
    if(timer == 1){
        //开启定时任务
        client.set("TimerStatus", "2");
        this.timer('');
    }else if(timer == 2){
        //关闭定时任务
        this.timer('close');
        client.set("TimerStatus", "1");
    }
};

//新增内容
exports.domainAdd = (domain, mark, gid, rand, sort, id, callback) => {
    if(id){
        db.query("UPDATE `express`.`T_Domain` SET `domain` = ?, `mark` = ?, `gid` = ?, `rand` = ?, `sort` = ? WHERE `id` = ?", {
            replacements: [domain, mark, gid, rand, sort, id],
        }).spread((res) => {
            let result = {};
            result.status = true;
            result.msg = '更新成功';
            result.data = res;
            //更新redis
            redisController.redisController.updateRedis();
            callback(result);
        });
    }else{
        db.query("SELECT * FROM express.T_Domain WHERE domain = ?", {
            replacements: [domain]
        }).spread((results) => {
            let result = {};
            if(results.length > 0){
                result.status = false;
                result.msg = '该域名已存在';
                result.data = '';
                callback(result);
            }else{
                db.query("INSERT INTO `express`.`T_Domain`(`domain`, `mark`, `gid`, `rand`, `sort`, `create_time`, `status`) VALUES (?, ?, ?, ?, ?, NOW(), 1)", {
                    replacements: [domain, mark, gid, rand, sort],
                }).spread((res) => {
                    //更新redis
                    redisController.redisController.updateRedis();
                    result.status = true;
                    result.msg = '新增域名成功';
                    result.data = res;
                    callback(result);
                });
            }
        });
    }
};
//管理域名
exports.domainList = (keywords, rand, status, sorts, callback) => {
    let sql = '';
    let _sql = 'WHERE 1 = 1';
    let _sql1 = 'BY id ASC';
    if(keywords){
        if(keywords < 5){
            _sql += " AND mark = "+keywords;
        }else{
            _sql += " AND (domain LIKE '%"+keywords+"%' OR gid = '"+keywords+"') ";
        }
    };
    if(rand){
        _sql += " AND rand = "+rand;
    };

    if(status){
        _sql += " AND status = "+status;
    };

    if(sorts == 2){
        _sql1 = 'BY create_time ASC';
    }else if(sorts == 3){
        _sql1 = 'BY create_time DESC';
    }else if(sorts == 4){
        _sql1 = 'BY close_time ASC';
    }else if(sorts == 5){
        _sql1 = 'BY close_time DESC';
    }
    sql = "SELECT * FROM express.T_Domain " + _sql + " ORDER " + _sql1;

    db.query(sql, {
        replacements: [keywords],
    }).spread((results) => {
        //callback(results);

        let result = {
            data : [],
            timer : ''
        };

        for (key in results) {
            if (results.hasOwnProperty(key)) {
                result.data.push(results[key]);
            }
        }
        callback(result);
    });
};

//删除内容
exports.domainDelete = (id, callback) => {
    db.query("UPDATE `express`.`T_Domain` SET `status` = 3 WHERE `id` = ?", {
        replacements: [id]
    }).spread((results) => {
        let result = {};
        if(results.affectedRows > 0){
            //更新redis
            redisController.redisController.updateRedis();
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

//禁用启用
exports.operation = (id, status, callback) => {
    db.query("UPDATE `express`.`T_Domain` SET `status` = ? WHERE `id` = ?", {
        replacements: [status, id]
    }).spread((results) => {
        let result = {};
        if(results.affectedRows > 0){
            //更新redis
            redisController.redisController.updateRedis();
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

//获取单条记录
exports.domainOneList = (id, callback) => {
    db.query("SELECT * FROM express.T_Domain WHERE `id` = ?", {
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
