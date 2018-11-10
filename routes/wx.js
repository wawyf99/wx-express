var express = require('express');
var router = express.Router();
const wxServer = require('../server/wx-server');

//获取微信公众号列表
router.post('/wxList', function(req, res, next) {
    let keywords = req.body.keywords,
        sorts = req.body.sorts,
        status = req.body.status;
    wxServer.wxList(keywords, sorts, status, result => {
        res.send(result);
    })

});

//新增公众号
router.post('/wxAdd', function(req, res, next) {
    let item = {
        title: req.body.title,
        app_id: req.body.app_id,
        app_secret: req.body.app_secret,
        token: req.body.token,
        key: req.body.key,
        redirect_url: req.body.redirect_url,
        authorizer_app_id: req.body.authorizer_app_id
    },
        id = req.body.id;
    wxServer.wxAdd(item, id, result => {
        res.send(result);
    })
});

//获取单条记录
router.post('/wxGetOne', function(req, res, next) {
    let id = req.body.id;
    wxServer.wxGetOne(id, result => {
        res.send(result);
    })
});

//修改状态
router.post('/wxOperation', function(req, res, next) {
    let id = req.body.id,
        status = req.body.status;
    wxServer.wxOperation(id, status, result => {
        res.send(result);
    })
});

//删除
router.post('/wxDel', function(req, res, next) {
    let id = req.body.id;
    wxServer.wxDel(id, result => {
        res.send(result);
    })
});

//获取公众号列表
router.post('/wechatList', function(req, res, next) {
    let keywords = req.body.keywords,
        sorts = req.body.sorts,
        status = req.body.status;
    wxServer.wechatList(keywords, sorts, status, result => {
        res.send(result);
    })
});

//禁封公众号
router.post('/wechatDel', function(req, res, next) {
    let id = req.body.id;
    wxServer.wechatDel(id, result => {
        res.send(result);
    })
});

//更改状态
router.post('/wechatOperation', function(req, res, next) {
    let id = req.body.id,
        status = req.body.status;
    wxServer.wechatOperation(id, status, result => {
        res.send(result);
    })
});

//公众号新增
router.post('/wechatAdd', function(req, res, next) {
    let app_id = req.body.app_id,
        app_secret = req.body.app_secret,
        id = req.body.id;
    wxServer.wechatAdd(app_id, app_secret, id, result => {
        res.send(result);
    })
});

//获取单条记录
router.post('/wechatGetOne', function(req, res, next) {
    let id = req.body.id;
    wxServer.wechatGetOne(id, result => {
        res.send(result);
    })
});

//设置公众号接入方式
router.post('/conect', function (req, res, next) {
    wxServer.conect(result => {
        res.send(result);
    })
})

//获取接入方式

router.post('/getConect', function (req, res, next) {
    wxServer.getConect(result => {
        res.send(result);
    })
})
module.exports = router;