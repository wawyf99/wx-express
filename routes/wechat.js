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

const WxSave = require('../common/wx/wx-save');

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
    let msgSignature = '814793ee193d671e431411448175c0ff483c4e29',
        timestamp = '1540453088',
        signature = '8d92bca7e176c63941225a60e942039fc791539e',
        nonce = '2022206236',
        encrypt_type = 'aes',
        componentVerifyTicket = '',
        createTime = '';

    var postData = {
        appid: 'wx4f68ecdbd31e27e1',
        Encrypt: 'S+7wuNfoAa5vtbX6gZ+XqxuwKNzC6l0Ovmr0PgJI5ZnF/Gq+NC90nnpgKNz8IFe7HCUaBsFQ04qM2BuhVFb1ykzGxWki4NK42THaZLk5Da9iTzZMEULeM9b+JT6k2MrmWVPlGnZ0qcj0iBe0ykIhhmLts/aT5PC0W8wgaoTinejFkAhXGJcw1GHKfPCsiPC2lGZrhb1l/p8F2qMTrKlabKh3qrRp024dYlZLcg0L8gARUWwdGzxJG1thSj5/sFd37MobjftNTO8tYQgsJf34d2zaIkNGxSIByWwr0+ne0pDHxV/80xPCFyKGrPyLVN5Ng79NLHotnu2Rf1oIW1NHDOuQpctO09qjf2Tep1adUC0ssFcVBYfQ0xjVZ3hcCy43PAGnjwigw/SOoHBL4M9Pi1poeNqTb2yaiLpQCPnVJv0cnpYdu1X9ObB7RoitWoK4gAj8ikE5q6QxnBV9ruYGUA=='
    };


});

//微信事件推送的入口
router.post('/receive', function(req, res, next) {

    //获取参数
    let msgSignature = req.query.msgSignature,
        timestamp = req.query.timestamp,
        signature = req.query.signature,
        nonce = req.query.nonce,
        encrypt_type = req.query.encrypt_type;
    let postData = req.body.xml;
    console.log(postData);
    WxSave.getComponentVerifyTicket(msgSignature, timestamp, signature, nonce, encrypt_type, postData).then(result=>{
        res.send(result);
    })


});
module.exports = router;