var express = require('express');
var router = express.Router();
var fetch = require('node-fetch');
var sha1 = require('sha1');
const wecaht = require('../common/wechat/wechat-oath'),
    config = require('../common/wechat/wechat-config'),
    utils = require('../common/wechat/wechat-util'),
    wxApi = require('../common/wechat/wxnew-api'),
    wechatServer = require('../server/wechat-server');


/**
 * 微信授权
 */
router.get('/wechat-auth', (req, res, next) => {
    wecaht.wechatAuthentication.authenticationUtility(req).then(result => {
        res.redirect(result);
    });
});

/*
* 微信静默授权
* */
router.get('/wechat_accredit', (req, res, next) => {
    var _accountId = req.query.accountId,
        _clubId = req.query.clubId;
    wecaht.wechatAuthentication.authorization(_accountId, _clubId, req).then(result => {
        res.redirect(result);
    });
});

/*
* 获取openId
* */
router.get('/wechat_getinfo', (req, res, next) => {
    if (req.query.code && req.query.code != "") {
        wecaht.wechatAuthentication.authenticationCodes(req.query.code).then(result => {
            if(result){
                var openId = result;
                wechatServer.getShareInfo(req.query.accountId, req.query.clubId, openId, results => {
                    res.send(results);
                })
            }
        });
    } else {
        res.send('非法链接');
    }
});

//路由跳转
router.get('/gateway', function (req, res, next) {
    if (req.query.code && req.query.code != "") {
        /*
        //验证是否正式服授权->不是正式服务器将code跳转至测试服务器
        if (req.query.pattern == "false") {
            var url = req.query.url + '?code=' + req.query.code;
            res.redirect(url);
        } else {
            res.redirect('/wechat/wechat-login?code=' + req.query.code);
        }
        */

        var url = req.query.url + '?code=' + req.query.code;
        res.redirect(url);
    } else {
        res.send('非法链接');
    }
});

//路由跳转
router.get('/junmpLink', function (req, res, next) {
    if (req.query.code && req.query.code != "") {
        var url = req.query.url + "?accountId="+ req.query.accountId + "&clubId="+ req.query.clubId + "&code=" + req.query.code;
        res.redirect(url);
    } else {
        res.send('非法链接');
    }
});

/**
 * 微信授权登录
 */
router.get('/wechat-login', (req, res, next) => {
    if (req.query.code && req.query.code != "") {
        //验证是否正式服授权->不是正式服务器将code跳转至测试服务器
        wecaht.wechatAuthentication.authenticationCode(req.query.code).then(result => {
            utils.wechatUtil.receiveEvent({
                senderId: result
            });
            res.redirect(config.WechatConfig.clientUrl + '?code=' + result);
        });
    } else {
        res.send('非法链接');
    }
});


/**
 * 微信签名校验
 */
router.get('/receive', function (req, res) {
    if (utils.wechat.checkSignature(req)){
        var result = res.status(200).send(req.query.echostr);
        res.send(result);
    }
});


/**
 * 接收微信像服务器发送的消息
 * 根据消息类型做处理后,响应微信服务器
 */
router.post('/receive', function (req, res, next) {
    console.log('postReceive');
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

router.post('/wxinfo', (req, res, next) => {
    var _url = req.body.url;
    wxApi.WxApi.getShareConfig(_url).then(result => {
        res.send(result);
    });
});

module.exports = router;