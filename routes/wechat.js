var express = require('express');
var router = express.Router();
/*var WXAuth = require('wechat-auth');*/
//var request = require('request');
const WXBizMsgCrypt = require('wxcrypt');
var sha1 = require('sha1');


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
/*router.get('/test', (req, res, next) => {

    /!*let msgSignature = req.query.msgSignature,
        timestamp = req.query.timestamp,
        signature = req.query.signature,
        nonce = req.query.nonce,
        encrypt_type = req.query.encrypt_type;*!/
    console.log(req.rawBody);
/!*    new WXBizMsgCrypt('MZsJy64XTu1awjsnjsamFSKiJP', 'VzqDMZsJyGqgwmTPu1j8y64X6JzG8f6zdFSKiZA4RKj', 'wx4f68ecdbd31e27e1');

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
    });*!/


        //console.log(msgSignature,timestamp,signature,nonce,encrypt_type);
    /!*wx.decryptMsg(msgSignature, timestamp, nonce, req.body).then(res => {
        console.log(res);
    });*!/
});*/

//微信事件推送的入口
router.get('/test', function(req, res, next) {
    //获取参数
/*    var query = req.query;
    //签名
    var signature = query.signature;
    //输出的字符，你填写的TOKEN
    var echostr = query.echostr;
    //时间戳
    var timestamp = query['timestamp'];
    //随机字符串
    var nonce = query.nonce*/;

/*    let msgSignature = 'a1bef7a312e14c1141b6f2f70e9b4d11e1ddff39',
        timestamp = '1540372139',
        signature = '07d68471adc80b16a31115a4d8c9d5e56a386475',
        nonce = '747817170',
        encrypt_type = 'aes';*/

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
    console.log(scyptoString);
    if (signature == scyptoString) {
        console.log('ok');
//获取xml数据
        /*req.on("data", function(data) {
            //将xml解析
            parser.parseString(data.toString(), function(err, result) {
                var body = result.xml;
                var messageType = body.MsgType[0];
                //用户点击菜单响应事件
                if(messageType === 'event') {
                    var eventName = body.Event[0];
                    (EventFunction[eventName]||function(){})(body, req, res);
                    //自动回复消息
                }else if(messageType === 'text') {
                    EventFunction.responseNews(body, res);
                    //第一次填写URL时确认接口是否有效
                }else {
                    res.send(echostr);
                }
            });
        });*/
    } else {
        //认证失败，非法操作
        console.log('ok');
    }

});

module.exports = router;