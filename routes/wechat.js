var express = require('express');
var router = express.Router();
/*var WXAuth = require('wechat-auth');*/
//var request = require('request');
const WXBizMsgCrypt = require('wxcrypt');



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
router.get('/tests', (req, res, next) => {
    var _s = new WXBizMsgCrypt('MZsJy64XTu1awjsnjsamFSKiJP', 'VzqDMZsJyGqgwmTPu1j8y64X6JzG8f6zdFSKiZA4RKj', 'wx4f68ecdbd31e27e1');
    let msgSignature = '5c1a35ae0c86eaf1860c7b5d21ab249339a4fd96',
        timestamp = '1540443000',
        signature = '4490e72b540a562899735b8e37335f72035ff243',
        nonce = '1767535474',
        encrypt_type = 'aes';

    let ecn = 'XprcONnFEJg8P5UaYCoBM7Ib5zzG16jQs3ruKa0ON4VnZZ1/82WbchLZGoy0NzO9+Lmb18Ix8bvZj3IdE23lB8OPVA6AA8v5zkq/WdNr/2q5qbeb3GUacbSI2ycomtzbbKI6enS5pP9zY/POfMreRzhalb35aXwZVeq9YFWotyVsAJULkTyPbzPWL+4hKx7d0je9cz7niyC7/m6MB0dNM66krudM5MxVKPMUs1g6MsR4SJ07WyxXE03F2H4T3kOxRwwJ+c6369ZsxfkmraVi3xzXqy8EEl0bdM+VK28INFR0yemrLwERJ8MEq74dj/zUH5D71d+V6ajN0oho9O1IXwgA/ttJDLeTDfmHlnt+VKMC9i6tmV28YcNWmsBS+oDjRu0TUhMWSwYxun75LO7NBR1TZqRsFVMmQGF9P49kLdCbhsv5hxQz1AEqMHuP3+Gnndv5/w5CY04hgIOzIzSeNA==';

   console.log(_s.decrypt(msgSignature, timestamp, nonce, ecn))

});

//微信事件推送的入口
router.post('/test', function(req, res, next) {
    //获取参数
    let msgSignature = req.query.msgSignature,
        timestamp = req.query.timestamp,
        signature = req.query.signature,
        nonce = req.query.nonce,
        encrypt_type = req.query.encrypt_type;
    let encrypt = req.body.xml;

    let _s = new WXBizMsgCrypt('MZsJy64XTu1awjsnjsamFSKiJP', 'VzqDMZsJyGqgwmTPu1j8y64X6JzG8f6zdFSKiZA4RKj', 'wx4f68ecdbd31e27e1');

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
    console.log(encrypt);
    if (signature == scyptoString) {
        console.log('okok');
        console.log(_s.decrypt(msgSignature, timestamp, nonce, encrypt));
    } else {
        //认证失败，非法操作
        console.log('cuowu');
    }

});

module.exports = router;