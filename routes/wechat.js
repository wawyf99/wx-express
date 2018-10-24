var express = require('express');
var router = express.Router();
/*var WXAuth = require('wechat-auth');*/
//var request = require('request');
const WXBizMsgCrypt = require('wxcrypt');

var bodyParser = require("body-parser");
require("body-parser-xml")(bodyParser);

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
router.get('/test', (req, res, next) => {

    /*let msgSignature = req.query.msgSignature,
        timestamp = req.query.timestamp,
        signature = req.query.signature,
        nonce = req.query.nonce,
        encrypt_type = req.query.encrypt_type;*/
    console.log(req.rawBody);
/*    new WXBizMsgCrypt('MZsJy64XTu1awjsnjsamFSKiJP', 'VzqDMZsJyGqgwmTPu1j8y64X6JzG8f6zdFSKiZA4RKj', 'wx4f68ecdbd31e27e1');

    let msgSignature = 'a1bef7a312e14c1141b6f2f70e9b4d11e1ddff39',
        timestamp = '1540372139',
        signature = '07d68471adc80b16a31115a4d8c9d5e56a386475',
        nonce = '747817170',
        encrypt_type = 'aes';



    var _s = WXBizMsgCrypt({
        xml: {
            timestamp: 1536123965810,
            articles: [
                {
                    title: 'Article1',
                    desc: 'Description1'
                },
                {
                    title: 'Article2',
                    desc: 'Description2'
                }
            ]
        }
    });*/


        //console.log(msgSignature,timestamp,signature,nonce,encrypt_type);
    /*wx.decryptMsg(msgSignature, timestamp, nonce, req.body).then(res => {
        console.log(res);
    });*/
});

module.exports = router;