const WXBizMsgCrypt = require('wxcrypt');
const { x2o } = require('wxcrypt');
var sha1 = require('sha1');
var Redis = require('ioredis');
var redis = new Redis();
var request = require('request');

const WxSave = {
    WxConfig : '',
    //获取ComponentVerifyTicket;
    getComponentVerifyTicket: function (signature, timestamp, nonce, encrypt_type, msg_signature, postData) {
        return new Promise(function (resolve, reject) {
            //获取WxConfig;
            let WxConfig = WxSave.WxConfig;
            let _s = new WXBizMsgCrypt(WxConfig.token, WxConfig.key, WxConfig.app_id);
            let componentVerifyTicket = '',
                createTime = '';
            //验证签名
            let oriArray = new Array();
            oriArray[0] = nonce;
            oriArray[1] = timestamp;
            oriArray[2] = WxConfig.token;
            //排序参数
            oriArray.sort();
            let original = oriArray[0] + oriArray[1] + oriArray[2];
            //加密
            let scyptoString = sha1(original);
            let encryptStr = postData.encrypt;

            //判断是否与你填写TOKEN相等
            if (signature == scyptoString) {
                let encrypt_str = _s.decrypt(msg_signature, timestamp, nonce, encryptStr);
                console.log(encrypt_str);
                let objXml = x2o(encrypt_str);
                console.log(objXml);
                componentVerifyTicket = objXml.xml.ComponentVerifyTicket;
                createTime = objXml.xml.CreateTime;
                if (componentVerifyTicket && createTime) {
                    redis.select(5);
                    redis.hmset(WxConfig.id+'_ticket', new Map([['createTime', createTime], ['componentVerifyTicket', componentVerifyTicket]]), function (err, result) {
                        if (result == 'OK') {
                            redis.expire(WxConfig.id+'_ticket', 600);
                            resolve('success');
                        }
                    });
                }
            } else {
                //认证失败，非法操作
                resolve('签名字符串校验失败');
            }
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
            let WxConfig = WxSave.WxConfig;
            //判断是否有component_access_token
            redis.select(5);
            redis.hgetall(WxConfig.id+'_access_token').then(res1 => {
                if(res1.component_access_token){
                    resolve(res1.component_access_token);
                }else {
                    //从redis中获取ticket
                    let WxConfig = WxSave.WxConfig;
                    redis.select(5);
                    redis.hgetall(WxConfig.id+'_ticket').then(res => {
                        if (res.componentVerifyTicket) {
                            var data = {
                                "component_appid": WxConfig.app_id,
                                "component_appsecret": WxConfig.app_secret,
                                "component_verify_ticket": res.componentVerifyTicket
                            };
                            data = JSON.stringify(data);
                            request.post({
                                url: 'https://api.weixin.qq.com/cgi-bin/component/api_component_token',
                                form: data
                            }, function (err, httpResponse, result) {
                                result = JSON.parse(result);
                                if (result.component_access_token) {
                                    redis.select(5);
                                    redis.hmset(WxConfig.id+'_access_token', new Map([['expires_in', result.expires_in], ['component_access_token', result.component_access_token]]), function (err, results) {
                                        if (results == 'OK') {
                                            redis.expire(WxConfig.id+'_access_token', 7200);
                                            resolve(result.component_access_token);
                                        }
                                    });
                                }
                            })
                        }
                    });
                }
            })
        })
    },
    //获取pre_auth_code
    getPre_auth_code: function () {
        return new Promise(function (resolve, reject) {
            //从redis中获取ticket
            let WxConfig = WxSave.WxConfig;
            //从redis中获取component_access_token
            redis.select(5);
            redis.hgetall(WxConfig.id+'_access_token').then(res => {
                if (res.component_access_token) {
                    //如果有
                    //console.log(WxConfig.AppId);
                    var data = {
                        "component_appid": WxConfig.app_id,
                    };
                    data = JSON.stringify(data);
                    request.post({
                        url: 'https://api.weixin.qq.com/cgi-bin/component/api_create_preauthcode?component_access_token=' + res.component_access_token,
                        form: data
                    }, function (err, httpResponse, result) {
                        result = JSON.parse(result);
                        if (result.pre_auth_code) {
                            redis.hmset(WxConfig.id+'_auth_code', new Map([['expires_in', result.expires_in], ['pre_auth_code', result.pre_auth_code]]), function (err, results) {
                                if (results == 'OK') {
                                    redis.expire(WxConfig.id+'_auth_code', 1800);
                                    resolve(result.pre_auth_code);
                                }
                            });
                        }
                    })
                } else {
                    //如果没有则获取
                    WxSave.getComponent_access_token().then(res1 => {
                        if(res1){
                            WxSave.getPre_auth_code().then(res2 => {
                                resolve(res2);
                            })
                        }

                    })
                }
            })
        })
    },
    //授权
    accredit:function () {

        return new Promise(function (resolve, reject) {

            let WxConfig = WxSave.WxConfig;
            redis.select(5);
            redis.hgetall(WxConfig.id+'_auth_code').then(res => {
                if(res.pre_auth_code){
                    var _url = 'https://mp.weixin.qq.com/cgi-bin/componentloginpage?component_appid='+WxConfig.app_id+'&pre_auth_code='+res.pre_auth_code+'&redirect_uri='+WxConfig.redirect_url+'&auth_type=1';
                    let resutss = {
                        status : 'true',
                        href: '',
                    };
                    resutss.href = _url;
                    resolve(resutss);
                }else{
                    //如果没有则获取
                    WxSave.getPre_auth_code().then(res13 => {
                        if(res13){
                            var _url = 'https://mp.weixin.qq.com/cgi-bin/componentloginpage?component_appid='+WxConfig.app_id+'&pre_auth_code='+res13+'&redirect_uri='+WxConfig.redirect_url+'&auth_type=1';
                            let resutss = {
                                status : 'true',
                                href: '',
                            };
                            resutss.href = _url;
                            resolve(resutss);
                        }
                    })
                }
            })
        })
    },

    //通过AuthCode获取authorizer_access_token&authorizer_refresh_token
    getAuthorizerToken:function (AppId, AuthCode) {
        return new Promise(function (resolve, reject) {
            WxSave.getComponent_access_token().then(res=>{
                if(res){
                    console.log(AppId, AuthCode);
                    var data = {
                        "component_appid": AppId,
                        "authorization_code": AuthCode,
                    };
                    data = JSON.stringify(data);
                    request.post({
                        url: 'https://api.weixin.qq.com/cgi-bin/component/api_query_auth?component_access_token='+res,
                        form: data
                    }, function (err, httpResponse, result) {
                        result = JSON.parse(result);
                        if(result){
                            redis.select(5);
                            //redis.hmset('key', 100, 'EX', 10);
                            redis.hmset(AppId+'_authorizer_access_token', new Map([['authorizer_access_token', result.authorization_info.componentVerifyTicket]]), function (err, result) {
                                if (result == 'OK') {
                                    redis.expire(WxConfig.AppId+'_authorizer_access_token', 7200);
                                    resolve('success');
                                }
                            });
                            redis.hmset(AppId+'_authorizer_refresh_token', new Map([['authorizer_access_token', result.authorization_info.authorizer_refresh_token]]), function (err, result) {
                                if (result == 'OK') {
                                    redis.expire(WxConfig.AppId+'_authorizer_refresh_token', 7200);
                                    resolve('success');
                                }
                            });
                        }
                        console.log(result);
                    })
                }
            })
        })
    },
}
module.exports = WxSave;