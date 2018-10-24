var express = require('express');
var router = express.Router();
/*var WXAuth = require('wechat-auth');*/
//var request = require('request');
const WXBizMsgCrypt = require('wxcrypt');

new WXBizMsgCrypt('MZsJy64XTu1awjsnjsamFSKiJP', 'VzqDMZsJyGqgwmTPu1j8y64X6JzG8f6zdFSKiZA4RKj', 'wx4f68ecdbd31e27e1');

var sha1 = require('sha1');
var XMLJS = require('xml2js');
var parser = new XMLJS.Parser();
//重组，将json重组为xml
var builder = new XMLJS.Builder();

/**
 * 微信授权
 */
router.get('/wechat-auth', (req, res, next) => {
    //console.log(req);
    request.post({url:'https://api.weixin.qq.com/cgi-bin/component/api_component_token', form: {
            "component_appid":"wx4f68ecdbd31e27e1" ,
            "component_appsecret": "decadbad385d1194afd0c24c036db522",
            "component_verify_ticket": "123123"
        }}, function(err,httpResponse,body){
        console.log(body);
    })
});
router.get('/', (req, res, next) => {
    //console.log(req);
});

//微信事件推送的入口
router.post('/test', function(req, res, next) {
    //获取参数
    let msgSignature = req.query.msgSignature,
        timestamp = req.query.timestamp,
        signature = req.query.signature,
        nonce = req.query.nonce,
        encrypt_type = req.query.encrypt_type;

    var oriArray = new Array();
    oriArray[0] = nonce;
    oriArray[1] = timestamp;
    oriArray[2] = 'MZsJy64XTu1awjsnjsamFSKiJP';
    //排序参数
    oriArray.sort();
    var original = oriArray[0]+oriArray[1]+oriArray[2];
    //加密
    var scyptoString = sha1(original);
    //判断是否与你填写TOKEN相等
    if (signature == scyptoString) {
        console.log('okok');
        let encrypt = req.body.xml;
        let s = WXBizMsgCrypt.decryptMsg(msgSignature, timestamp, nonce, req.body);

        console.log(s);
        console.log('1111111111111111111111111111111111111');
        console.log(encrypt);
    } else {
        //认证失败，非法操作
        console.log('cuowu');
    }

});

module.exports = router;