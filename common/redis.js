/*
* 处理redis
* */
var Redis = require('ioredis');
var redis = new Redis({
    port: 6379,          // Redis port
    host: 'jredis-cn-north-1-prod-redis-9wygffb7i5.jdcloud.com',   // Redis host
    password: 'redis-9wygffb7i5:Zhuoyue136326400',
})
//var client  = redis.createClient();
const connection = require('../common/db');
db = new connection('wx');

const redisController = {
    results : {
        status : false,
        data : [],
    },
    //更新redis
    updateRedis: function (domain) {
        return new Promise(function (resolve, reject) {
            db.query("SELECT id, domain, mark FROM wx.T_Domain WHERE `status` = 1", {
                replacements: []
            }).spread((results) => {
                //清空整个redis库
                redis.flushall();
                for (key in results) {
                    if (results.hasOwnProperty(key)) {
                        let _id = '',
                            _url = '',
                            _mark = results[key]['mark'],
                            _name = '';

                        switch (_mark) {
                            case 1:
                                _name = 'A1';
                                _id = results[key]['id'].toString();
                                _url = results[key]['domain'];
                                break;
                            case 2:
                                _name = 'A2';
                                _id = results[key]['id'].toString();
                                _url = results[key]['domain'];

                                break;
                            case 3:
                                _name = 'B1';
                                _id = results[key]['id'].toString();
                                _url = results[key]['domain'];
                                break;
                            case 4:
                                _name = 'C1';
                                _id = results[key]['id'].toString();
                                _url = results[key]['domain'];
                                break;
                        }

                        //更新redis
                        redis.select(_mark-1);
                        redis.hmset(_name, _id, _url,function (err, result) {
                            console.log(result);
                        });
                    }
                }
            });
        })
    },
    getRedis:function () {
        //results.data = [];
        redisController.results.data = [];
        redisController.results.status = false;
        return new Promise(function (resolve, reject) {
            var res = '';
            for(var i = 0; i <= 3; i ++){
                switch (i) {
                    case 0:
                        _name = 'A1';
                        break;
                    case 1:
                        _name = 'A2';
                        break;
                    case 2:
                        _name = 'B1';
                        break;
                    case 3:
                        _name = 'C1';
                        break;
                }
                redis.select(i);
                redis.hgetall(_name, function (err, result) {
                    if(result){
                        redisController.assemblyRedis(result).then(resss=>{
                            if(redisController.results.data.length > 0){
                                redisController.results.status = true;
                            }
                            resolve(redisController.results);
                        });
                    }else{
                        console.log(err);
                    }
                });
            }

        })
    },
    assemblyRedis:function (result) {
        return new Promise(function (resolve, reject) {
            for (var t in result) {
                if (result.hasOwnProperty(t)) {
                    var arr = {
                        id : '',
                        url : '',
                    };
                    arr.id = t;
                    arr.url = result[t];
                    redisController.results.data.push(arr);
                }
            }
            resolve(redisController.results.data);
        });
    },
    //更新公众号
    updateWechat:function () {
        return new Promise(function (resolve, reject) {
            db.query("SELECT id, app_id, app_secret FROM wx.T_Wx_Wechat WHERE `status` = 3", {
                replacements: []
            }).spread((results) => {
                let arr = {},
                    id = '';
                redis.select(4);
                redis.del('Ticket');
                redis.del('AccessToken');
                if(results.length > 0){
                    arr.id = results[0].id;
                    arr.app_id = results[0].app_id;
                    arr.app_secret = results[0].app_secret;
                    id = results[0].id;

                    redis.hmset('Wechat', 'config', JSON.stringify(arr),function (err, result) {
                        resolve(result);
                    });

                }else{
                    redis.del('Wechat');
                }
            })
        })
    },
    //设计公众号接入方式
    setConect:function () {
        return new Promise(function (resolve, reject) {
            redis.select(4);
            redis.hgetall('Conect', function (err, result) {
                if(Object.keys(result).length != 0){
                    if(result.type == '1'){
                        redis.select(4);
                        redis.hmset('Conect', 'type', '2',function (err, res) {
                            resolve(res);
                        });
                    }else{
                        redis.select(4);
                        redis.hmset('Conect', 'type', '1',function (err, res) {
                            resolve(res);
                        });
                    }
                }else{
                    redis.select(4);
                    redis.hmset('Conect', 'type', '2',function (err, res) {
                        resolve(res);
                    });
                }
            });
        })
    },
    //获取公众号接入方式
    getConect:function () {
        return new Promise(function (resolve, reject) {
            redis.select(4);
            redis.hgetall('Conect', function (err, result) {
                let results = {};
                if(Object.keys(result).length != 0){
                    if(result.type == '1'){
                        results.data = true;
                        resolve(results);
                    }else{
                        results.data = false;
                        resolve(results);
                    }
                }else{
                    results.data = true;
                    resolve(results);
                }
            });
        })
    }


};

module.exports = {
    redisController: redisController
};