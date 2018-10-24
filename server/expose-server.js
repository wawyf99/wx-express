const connection = require('../common/db');
db = new connection('express');
const redisController = require('../common/redis');


/* 暴露域名*/
exports.exportDomain = (callback) => {
    //从redis中获取域名
    redisController.redisController.getRedis().then(res =>{
        var results = res.data;
        var result = {
            data:[]
        };
        //console.log(res);
        if(res.status){
            for (key in results) {
                if (results.hasOwnProperty(key)) {
                    var _b = {
                        'id' : '',
                        'url' : ''
                    };
                    _b.id = results[key]['id'];
                    _b.url = results[key]['url'];
                    result.data.push(_b);
                }
            }
            callback(result);
        }else{
            //更新redis
            redisController.redisController.updateRedis();
        }
    });

    //redisController.redisController.updateRedis();

    //从数据库直接区;
    /*db.query("SELECT id, domain FROM express.T_Domain WHERE `status` != 0", {
        replacements: []
    }).spread((results) => {
        var result = {
            data:[]
        };
        console.log(results);
        if(results){
            result.status = true;
            for (key in results) {
                if (results.hasOwnProperty(key)) {
                    var _a = result.data;

                    var _b = {
                        'id' : '',
                        'url' : ''
                    };
                    _b.id = results[key]['id'].toString();
                    _b.url = results[key]['domain'];
                    _a.push(_b);
                }
            }
            callback(result);
        }
    });*/
};

/* 处理域名*/
exports.detectionDomain = (id, callback) => {
    db.query("UPDATE `express`.`T_Domain` SET `status` = 0, `close_time` = now() WHERE `id` = ?", {
        replacements: [id]
    }).spread((results) => {
        let result = {};
        if(results.affectedRows > 0){
            //更新redis
            redisController.redisController.updateRedis();
            result.status = true;
            callback(result);
        }
    });
};