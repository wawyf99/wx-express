const WXBizMsgCrypt = require('wxcrypt');
const { x2o } = require('wxcrypt');
var sha1 = require('sha1');
var Redis = require('ioredis');
var redis = new Redis();
var request = require('request');

const WxSave = {

    //获取ComponentVerifyTicket;
    getComponentVerifyTicket: function (msgSignature, timestamp, signature, nonce, encrypt_type, postData) {
        return new Promise(function (resolve, reject) {
            //获取WxConfig;
            WxSave.getWxConfg().then(function (WxConfig) {
                let _s = new WXBizMsgCrypt(WxConfig.Token, WxConfig.key, WxConfig.AppId);
                let componentVerifyTicket = '',
                    createTime = '';

                //验证签名
                let oriArray = new Array();
                oriArray[0] = nonce;
                oriArray[1] = timestamp;
                oriArray[2] = WxConfig.Token;
                //排序参数
                oriArray.sort();
                let original = oriArray[0] + oriArray[1] + oriArray[2];
                //加密
                let scyptoString = sha1(original);
                //判断是否与你填写TOKEN相等
                if (signature == scyptoString) {
                    let encrypt_str = _s.decrypt(msgSignature, timestamp, nonce, postData.encrypt);
                    let objXml = x2o(encrypt_str);
                    //console.log(objXml);
                    componentVerifyTicket = objXml.xml.ComponentVerifyTicket;
                    createTime = objXml.xml.CreateTime;
                    if (componentVerifyTicket && createTime) {
                        redis.select(5);
                        //redis.hmset('key', 100, 'EX', 10);
                        redis.hmset(WxConfig.AppId+'-componentVerifyTicket', new Map([['createTime', createTime], ['componentVerifyTicket', componentVerifyTicket]]), function (err, result) {
                            if (result == 'OK') {
                                redis.expire('wx', 600);
                                resolve('success');
                            }
                        });
                    }
                } else {
                    //认证失败，非法操作
                    resolve('签名校验失败');
                }

            });
        })
    },

    //获取公众号配置;
    getWxConfg: function () {
        return new Promise(function (resolve, reject) {
            //从redis中获取配置;
            redis.select(5);
            redis.hgetall('wxConfig').then(res => {
                resolve(res);
            });
        })
    },

    //获取component_access_token
    getComponent_access_token: function () {
        return new Promise(function (resolve, reject) {
            //获取WxConfig;
            WxSave.getWxConfg().then(function (WxConfig) {
                //从redis中获取ticket
                redis.select(5);
                console.log('7');
                redis.hgetall(WxConfig.AppId+'-componentVerifyTicket').then(res => {
                    console.log('8');
                    if (res.componentVerifyTicket) {
                        console.log('9');
                        var data = {
                            "component_appid": WxConfig.AppId,
                            "component_appsecret": WxConfig.AppSecret,
                            "component_verify_ticket": res.componentVerifyTicket
                        };
                        data = JSON.stringify(data);
                        request.post({
                            url: 'https://api.weixin.qq.com/cgi-bin/component/api_component_token',
                            form: data
                        }, function (err, httpResponse, result) {
                            result = JSON.parse(result);
                            //console.log(result);
                            if (result.component_access_token) {
                                redis.select(5);
                                redis.hmset(WxConfig.AppId+'-component_access_token', new Map([['expires_in', result.expires_in], ['component_access_token', result.component_access_token]]), function (err, results) {
                                    if (results == 'OK') {
                                        redis.expire('component_access_token', 7200);
                                        resolve(result.component_access_token);
                                    }
                                });
                            }
                        })
                    }
                });

            })
        })
    },
    //获取pre_auth_code
    getPre_auth_code: function () {
        return new Promise(function (resolve, reject) {
            //获取WxConfig;
            WxSave.getWxConfg().then(function (WxConfig) {
                //从redis中获取component_access_token
                redis.select(5);

                redis.hgetall(WxConfig.AppId+'-component_access_token').then(res => {
                    console.log('4');
                    if (res.component_access_token) {
                        console.log('5');
                        //console.log(3);
                        //如果有
                        //console.log(WxConfig.AppId);
                        var data = {
                            "component_appid": WxConfig.AppId,
                        };
                        data = JSON.stringify(data);
                        request.post({
                            url: 'https://api.weixin.qq.com/cgi-bin/component/api_create_preauthcode?component_access_token=' + res.component_access_token,
                            form: data
                        }, function (err, httpResponse, result) {
                            result = JSON.parse(result);
                            //console.log(result);
                            if (result.pre_auth_code) {
                                redis.hmset(WxConfig.AppId+'-pre_auth_code', new Map([['expires_in', result.expires_in], ['pre_auth_code', result.pre_auth_code]]), function (err, results) {
                                    if (results == 'OK') {
                                        redis.expire('pre_auth_code', 1800);
                                        //console.log(result.pre_auth_code);
                                        resolve(result.pre_auth_code);
                                    }
                                });
                            }
                        })
                    } else {
                        console.log('6');
                        //如果没有则获取
                        WxSave.getComponent_access_token().then(res1 => {
                            if (res1) {
                                WxSave.getPre_auth_code().then(res=>{
                                    resolve(res);
                                });
                            }
                        })
                    }
                })
            })
        })
    },
    //授权
    accredit:function (url) {
        return new Promise(function (resolve, reject) {
            //获取WxConfig;
            WxSave.getWxConfg().then(function (WxConfig) {
                redis.select(5);
                redis.hgetall(WxConfig.AppId+'-pre_auth_code').then(res => {
                    console.log('1');
                    if(res.pre_auth_code){
                        console.log('2');
                        console.log(WxConfig);

                    var _url = 'https://mp.weixin.qq.com/cgi-bin/componentloginpage?component_appid='+WxConfig.AppId+'&pre_auth_code='+res.pre_auth_code+'&redirect_uri='+WxConfig.redirect_url+'&auth_type=1';
                        console.log(_url);
                        request.get({
                            url: _url,
                        }, function (err, httpResponse, result) {
                            //result = JSON.parse(result);
                            //console.log(result);

                            resolve(result);
                        })
                    }else{
                        console.log('3');
                        //如果没有则获取
                        WxSave.getPre_auth_code().then(res1 => {
                            if(res1){
                                WxSave.accredit();
                            }
                        })
                    }
                })
            })
        })
    },
    setRedis:function () {
        return new Promise(function (resolve, reject) {
            redis.select(5);
                redis.hmset('wxConfig',new Map([
                    ['AppId', 'wx4f68ecdbd31e27e1'],
                    ['AppSecret','f8168f4dc5fc23b796df3f94da49d117'],
                    ['Token', 'MZsJy64XTu1awjsnjsamFSKiJP'],
                    ['key', 'VzqDMZsJyGqgwmTPu1j8y64X6JzG8f6zdFSKiZA4RKj'],
                    ['redirect_url','http://wx.api.rzzc.ltd/wechat/wx4f68ecdbd31e27e1']
                ]), function (err, result) {
                    resolve(result);
                });
        })
    }
}
module.exports = WxSave;