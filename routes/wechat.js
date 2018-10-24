var express = require('express');
var router = express.Router();
/*var WXAuth = require('wechat-auth');*/
var request = require('request');


/**
 * 微信授权
 */
router.get('/wechat-auth', (req, res, next) => {
    console.log(req);
    request.post({url:'https://api.weixin.qq.com/cgi-bin/component/api_component_token', form: {
            "component_appid":"wx4f68ecdbd31e27e1" ,
            "component_appsecret": "decadbad385d1194afd0c24c036db522",
            "component_verify_ticket": "123123"
        }}, function(err,httpResponse,body){
        console.log(body);
    })
});
router.get('/', (req, res, next) => {
    console.log(req);
});
router.get('/test', (req, res, next) => {
    console.log(req);
});

module.exports = router;