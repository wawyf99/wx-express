var express = require('express');
var router = express.Router();
const chatServer = require('../server/chat-server');

/**
 * 测试接口
 */
router.get('/', (req, res, next) => {
    res.send('qwertyu');
});

/**
 * 获取群聊标题-前台
 */
router.post('/get-title', (req, res, next) => {
    chatServer.getTitle(result => {
        res.send(result);
    });
});

/**
 * 管理群聊信息
 */
router.post('/manageTitle', (req, res, next) => {
    let keywords = req.body.keywords;
    chatServer.manageTitle(keywords, result => {
        res.send(result);
    });
});

/**
 * 新增内容
 */
router.post('/addTitle', (req, res, next) => {
    let title = req.body.title,
        img = req.body.img,
        enrollment = req.body.enrollment,
        invitor = req.body.invitor,
        id = req.body.id;
    chatServer.addTitle(title, img, enrollment, invitor, id, result => {
        res.send(result);
    });
});

/*
* 获取单条内容
* */
router.post('/getTitle', (req, res, next) => {
    let id = req.body.id;
    chatServer.getTitles(id, result => {
        res.send(result);
    });
});

/**
 * 删除内容&更新内容
 */
router.post('/deleteTitle', (req, res, next) => {
    let id = req.body.id;
    chatServer.deleteTitle(id, result => {
        res.send(result);
    });
});

module.exports = router;