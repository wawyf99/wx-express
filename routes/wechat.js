var express = require('express');
var router = express.Router();
const WxSave = require('../common/wx/wx-save');
const wechatServer = require('../server/wechat-server');

const wecaht = require('../common/wechat/wechat-oath'),
    config = require('../common/wechat/wechat-config'),
    utils = require('../common/wechat/wechat-util'),
    wxApi = require('../common/wechat/wxnew-api'),
    wechatServer = require('../server/wechat-server');

/**
 * 微信授权
 */
router.get('/', (req, res, next) => {
    let id = req.query.id;
    wechatServer.getWxConfig(id, result => {
        if(result.status){
            WxSave.WxConfig = result.data;
            WxSave.accredit().then(ress=>{
                res.send(ress);
            })
        }
    })

});

router.get('/test', (req, res, next) => {
    let msg_signature = 'dec8f2b9259a925885f247e29e43ca2480d59d03',
        timestamp = '1540551636',
        signature = '1d98a6a6ae157868f6b27d28a65143059ee6f137',
        nonce = '160117581',
        encrypt_type = 'aes',
        componentVerifyTicket = '',
        createTime = '';

    var postData = {
        appid: 'wx7566be2c0098c99c',
        appid: 'wx7566be2c0098c99c',
        encrypt: 'KvEkMbthWQ/5AMdh9eAf9xG6SR5ZZSY5vecN+X/wSkBOVDYeB9+rfwC7f/dSc2Igtf8DzIx/8uyCe9EcaaDTVzrf32o2ncnQANC3OvH/SXBlX7SjZuyqaISx0+8PI1F9YLOSYzG5ZneyCG0mhEXYIsVwIdvK5MxS1kmzajbQIVOCjKGLGPa8ktUeRy36LW2MDFo3hQdPX5BFv9uGryafhhIhv2/3yGOihQP3O60dsxon5RPD2IQnozlk4Zsq3F57jrGa59/i8CqwjHFCrg9rHRnO+IydPTcPmSIJ7KZLBBmeGFTbGvIBY0qHUOpig11gITZO954tMQRfa032zeTQT3fg6El8cStQJuc00nXRK8Hd//yPGEEut4olpCBfSyrc4tp29US7Y42eyvCfBN8bpwZeKOAgTTqrdBtYwKRTVcD+jBhI90dxFqkqs+XJUylxuEjjB5CuP1kB/Y9y1zU/LA=='
    };
    let appid = postData.appid;
    wechatServer.getWxId(appid, result => {
        if(result.status){
            WxSave.WxConfig = result.data;
            //console.log(4);
            WxSave.getComponentVerifyTicket(signature, timestamp, nonce, encrypt_type, msg_signature, postData).then(results=>{
                res.send(results);
            })
        }
    })
});
router.get('/tests', (req, res, next) => {
    WxSave.accredit().then(res=>{
        //console.log(res);
    })
});
router.get('/redisWrite',(req,res,next) => {
    let appid = 'wx7566be2c0098c99c';

    wechatServer.getWxId(appid, result => {
        WxSave.setRedis();
    })
})

//微信事件推送的入口
router.post('/receive', function(req, res, next) {
    //获取参数
    let signature = req.query.signature,
        timestamp = req.query.timestamp,
        nonce = req.query.nonce,
        encrypt_type = req.query.encrypt_type,
        msg_signature = req.query.msg_signature;
    let postData = req.body.xml;
    //根据AppId从数据库取得id;
    //console.log(postData);
    let appid = postData.appid;
    wechatServer.getWxId(appid, result => {
        if(result.status){
            WxSave.WxConfig = result.data;
            WxSave.getComponentVerifyTicket(signature, timestamp, nonce, encrypt_type, msg_signature, postData, ).then(result=>{
                res.send(result);
            })
        }
    })

});

//微信公众号事件推送的入口
router.post('/receives', function(req, res, next) {
    //非法请求
    if (!utils.wechat.checkSignature(req))
        return;
    utils.wechat.loop(req).then(r => {
        //处理微信发送的消息业务
        if (r.type === 'text') {
            utils.wechatUtil.receiveMessage(r.messageParameter);
        }
        //处理微信发送的事件业务
        else if (r.type === 'event') {
            utils.wechatUtil.receiveEvent(r.eventParameter);
        }
    });
    //响应微信服务器
    res.send('success');
});

router.post('/wxinfos', (req, res, next) => {
    var _url = req.body.url;
    wxApi.WxApi.getShareConfig(_url).then(result => {
        res.send(result);
    });
});

//更新token
router.post('/updateToken', function(req, res, next) {
    let AppId = req.body.AppId,
        AuthCode = req.body.AuthCode;
    wechatServer.getWxConfig(AppId, result => {
        if(result.status) {
            WxSave.WxConfig = result.data;
            WxSave.getAuthorizerToken(AppId, AuthCode).then(result => {
                res.send(result);
            })
        }
    })
});

//获取JSSDK的配置信息

router.post('/wxinfo', function(req, res, next) {
    let url = req.body.url,
        wxid = req.body.wxid;
    if(wxid){
        wechatServer.getWxConfig(wxid, result => {
            if(result.status){
                WxSave.WxConfig = result.data;
                //获取微信分享的配置晚间
                WxSave.getJssdkConfig(url).then(result=>{
                    res.send(result);
                })
            }
        })
    }
});

module.exports = router;