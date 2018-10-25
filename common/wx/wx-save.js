const WXBizMsgCrypt = require('wxcrypt');
const x2o = require('wxcrypt');
var sha1 = require('sha1');
var Redis = require('ioredis');
var redis = new Redis();


const WxSave = {

    //获取ComponentVerifyTicket;
    getComponentVerifyTicket:function (msgSignature, timestamp, signature, nonce, encrypt_type, postData) {
        return new Promise(function (resolve, reject) {

            redis.select(5);
            redis.hmset('wxConfig',new Map([
                ['AppId', 'wx4f68ecdbd31e27e1'],
                ['AppSecret','f8168f4dc5fc23b796df3f94da49d117'],
                ['Token', 'MZsJy64XTu1awjsnjsamFSKiJP'],
                ['key', 'VzqDMZsJyGqgwmTPu1j8y64X6JzG8f6zdFSKiZA4RKj'],
            ]), function (err, result) {
                console.log(result);
            });

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
                let original = oriArray[0]+oriArray[1]+oriArray[2];
                //加密
                let scyptoString = sha1(original);
                //判断是否与你填写TOKEN相等
                if (signature == scyptoString) {
                    let encrypt_str = _s.decrypt(msgSignature, timestamp, nonce, postData.encrypt);
                    let objXml = x2o(encrypt_str);
                    componentVerifyTicket = objXml.xml.ComponentVerifyTicket;
                    createTime = objXml.xml.CreateTime;
                    if(componentVerifyTicket && createTime){
                        redis.select(5);
                        //redis.hmset('key', 100, 'EX', 10);
                        redis.hmset('wx',new Map([['createTime', createTime], ['componentVerifyTicket', componentVerifyTicket]]), function (err, result) {
                            if(result == 'OK'){
                                redis.expire('wx',600);
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
    getWxConfg:function () {
        return new Promise(function (resolve, reject) {
            //从redis中获取配置;
            redis.select(5);
            redis.hgetall('wxConfig').then(res=>{
                resolve(res);
            });
        })
    }
}

module.exports = WxSave;