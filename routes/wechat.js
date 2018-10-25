var express = require('express');
var router = express.Router();
/*var WXAuth = require('wechat-auth');*/
//var request = require('request');
const WXBizMsgCrypt = require('wxcrypt');
const { x2o } = require('wxcrypt');
var sha1 = require('sha1');
/*var XMLJS = require('xml2js');
var parser = new XMLJS.Parser();
//重组，将json重组为xml
var builder = new XMLJS.Builder();*/

var Redis = require('ioredis');
var redis = new Redis();

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
router.get('/tests', (req, res, next) => {
    var _s = new WXBizMsgCrypt('MZsJy64XTu1awjsnjsamFSKiJP', 'VzqDMZsJyGqgwmTPu1j8y64X6JzG8f6zdFSKiZA4RKj', 'wx4f68ecdbd31e27e1');
    let msgSignature = '99dc217cf37b2d24c20fc6089940af0f054264dc',
        timestamp = '1540443526',
        signature = 'c45fa1cdd32dab264f8e6acc0e75577b97b20e1a',
        nonce = '225896623',
        encrypt_type = 'aes',
        componentVerifyTicket = '',
        createTime = '';

    var postData = {
        appid: 'wx4f68ecdbd31e27e1',
        Encrypt: 'S+7wuNfoAa5vtbX6gZ+XqxuwKNzC6l0Ovmr0PgJI5ZnF/Gq+NC90nnpgKNz8IFe7HCUaBsFQ04qM2BuhVFb1ykzGxWki4NK42THaZLk5Da9iTzZMEULeM9b+JT6k2MrmWVPlGnZ0qcj0iBe0ykIhhmLts/aT5PC0W8wgaoTinejFkAhXGJcw1GHKfPCsiPC2lGZrhb1l/p8F2qMTrKlabKh3qrRp024dYlZLcg0L8gARUWwdGzxJG1thSj5/sFd37MobjftNTO8tYQgsJf34d2zaIkNGxSIByWwr0+ne0pDHxV/80xPCFyKGrPyLVN5Ng79NLHotnu2Rf1oIW1NHDOuQpctO09qjf2Tep1adUC0ssFcVBYfQ0xjVZ3hcCy43PAGnjwigw/SOoHBL4M9Pi1poeNqTb2yaiLpQCPnVJv0cnpYdu1X9ObB7RoitWoK4gAj8ikE5q6QxnBV9ruYGUA=='
    };


    let ecn = 'S+7wuNfoAa5vtbX6gZ+XqxuwKNzC6l0Ovmr0PgJI5ZnF/Gq+NC90nnpgKNz8IFe7HCUaBsFQ04qM2BuhVFb1ykzGxWki4NK42THaZLk5Da9iTzZMEULeM9b+JT6k2MrmWVPlGnZ0qcj0iBe0ykIhhmLts/aT5PC0W8wgaoTinejFkAhXGJcw1GHKfPCsiPC2lGZrhb1l/p8F2qMTrKlabKh3qrRp024dYlZLcg0L8gARUWwdGzxJG1thSj5/sFd37MobjftNTO8tYQgsJf34d2zaIkNGxSIByWwr0+ne0pDHxV/80xPCFyKGrPyLVN5Ng79NLHotnu2Rf1oIW1NHDOuQpctO09qjf2Tep1adUC0ssFcVBYfQ0xjVZ3hcCy43PAGnjwigw/SOoHBL4M9Pi1poeNqTb2yaiLpQCPnVJv0cnpYdu1X9ObB7RoitWoK4gAj8ikE5q6QxnBV9ruYGUA==';


   var _t = _s.decrypt(msgSignature, timestamp, nonce, ecn);

    var objXml = x2o(_t);
    componentVerifyTicket = objXml.xml.ComponentVerifyTicket;
    createTime = objXml.xml.CreateTime;
    if(componentVerifyTicket && createTime){
        redis.select(5);
        //redis.hmset('key', 100, 'EX', 10);
        redis.hmset('wx',new Map([['createTime', createTime], ['componentVerifyTicket', componentVerifyTicket]]), function (err, result) {
            if(result == 'OK'){
                redis.expire('wx',600);
                res.send('success');
            }
        });
    }
});

//微信事件推送的入口
router.post('/receive', function(req, res, next) {
    //获取参数
    let msgSignature = req.query.msgSignature,
        timestamp = req.query.timestamp,
        signature = req.query.signature,
        nonce = req.query.nonce,
        componentVerifyTicket = '',
        createTime = '';
    let postData = req.body.xml;
    let _s = new WXBizMsgCrypt('MZsJy64XTu1awjsnjsamFSKiJP', 'VzqDMZsJyGqgwmTPu1j8y64X6JzG8f6zdFSKiZA4RKj', 'wx4f68ecdbd31e27e1');
    let encrypt_str = _s.decrypt(msgSignature, timestamp, nonce, postData.encrypt);

    //验证签名
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
        var objXml = x2o(encrypt_str);
        componentVerifyTicket = objXml.xml.ComponentVerifyTicket;
        createTime = objXml.xml.CreateTime;
        if(componentVerifyTicket && createTime){
            redis.select(5);
            //redis.hmset('key', 100, 'EX', 10);
            redis.hmset('wx',new Map([['createTime', createTime], ['componentVerifyTicket', componentVerifyTicket]]), function (err, result) {
                if(result == 'OK'){
                    redis.expire('wx',600);
                    res.send('success');
                }
            });
        }
    } else {
        //认证失败，非法操作
        console.log('签名验证失败');
    }

});

module.exports = router;