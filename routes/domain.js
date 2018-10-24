var express = require('express');
var router = express.Router();
const domainServer = require('../server/domain-server');

/**
 * 新增内容
 */
router.post('/domainAdd', (req, res, next) => {
    let domain = req.body.website,
        mark = req.body.mark,
        gid = req.body.gid,
        rand = req.body.rand,
        sort = req.body.sort,
        id = req.body.id;
    if(!sort){
        sort = 1;
    }
    domainServer.domainAdd(domain, mark, gid, rand, sort, id, result => {
        res.send(result);
    });
});

/**
 * 管理域名
 */
router.post('/domainList', (req, res, next) => {
    let keywords = req.body.keywords,
        rand = req.body.rand,
        sorts = req.body.sorts,
        status = req.body.status;
    switch (keywords) {
        case 'A1':
            keywords = 1;
            break;
        case 'A2':
            keywords = 2;
            break;
        case 'B1':
            keywords = 3;
            break;
        case 'C1':
            keywords = 4;
            break;
    }
    domainServer.domainList(keywords, rand, status, sorts, result => {
        res.send(result);
    });
});

/**
 * 删除域名
 */
router.post('/domainDelete', (req, res, next) => {
    let id = req.body.id;
    domainServer.domainDelete(id, result => {
        res.send(result);
    });
});

/**
 * 删除域名
 */
router.post('/operation', (req, res, next) => {
    let id = req.body.id,
        status = req.body.status;
    domainServer.operation(id, status, result => {
        res.send(result);
    });
});

//获取单条记录
router.post('/domainOneList', (req, res, next) => {
    let id = req.body.id;
    domainServer.domainOneList(id, result => {
        res.send(result);
    });
});

//管理定时任务
router.post('/domainTimer', (req, res, next) => {
    let timer = req.body.timer;
    domainServer.domainTimer(timer, result => {
        res.send(result);
    });
});





module.exports = router;