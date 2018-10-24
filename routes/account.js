/**
 * 后台账号路由类
 */
const express = require('express');
const router = express.Router();
const accountServer = require('../server/account-server');


/**
 * 用户登录
 */
router.post('/login', function (req, res, next) {
    let account = req.body.account;
    let password = req.body.password;
    accountServer.find(account, password, result => {
        if (result != null) {
            req.session.loginUser = result;
            res.send(result);
        } else {
            res.send(false);
        }
    });
});

/**
 * 获取用户权限
 */
router.get('/link', function (req, res, next) {
    var accountId = req.query.accountId;
    accountServer.getLink(accountId, result => {
        if (result != null) {
            res.send(result);
        }
    });
});

/**
 * 添加用户
 */
router.post('/add', function (req, res, next) {
    var obj = {
        accountId: req.body.accountId,
        account: req.body.account,
        password: req.body.password,
        roleid: req.body.roleid,
        nickname: req.body.nickname,
        link: req.body.link
    };
    var isAdd = req.body.isAdd;
    var accountId = req.body.accountId;
    if (isAdd && accountId == 0) {
        accountServer.addAccount(obj, (r) => {
            res.send(r);
        });
    } else {
        accountServer.update(obj, (r) => {
            res.send(r);
        });
    }
});

/**
 * 退出登录
 */
router.get('/loginout', (req, res, next) => {
    req.session.destroy();
    res.send(true);
});

/**
 * 修改密码
 */
router.post('/pwd', function (req, res, next) {
    let accountId = req.body.accountId;
    let oldpwd = req.body.oldpwd;
    let password = req.body.password;
    accountServer.updatePassword({
        accountId: accountId,
        oldpwd: oldpwd,
        password: password,
    }, r => {
        res.send(r);
    });
});

/**
 * 修改密码
 */
router.post('/restpwd', function (req, res, next) {
    let accountId = req.body.accountId,
        password = req.body.password;
    accountServer.restPassword({
        accountId: accountId,
        password: password,
    }, r => {
        res.send(r);
    });
});


/**
 * 禁用用户
 */
router.post('/disabled', function (req, res, next) {
    let accountId = req.body.accountId;
    let status = req.body.status ? 1 : 0;
    accountServer.disabled(accountId, status, (r) => {
        accountServer.list(0, "", result => {
            res.send(result);
        });
    });
});

/**
 * 验证用户是否存在
 */
router.get('/exists', function (req, res, next) {
    let account = req.query.account;
    accountServer.exists(account, (r) => {
        res.send(r);
    });
});

/**
 * 根据用户ID获取用户信息
 */
router.get('/account', function (req, res, next) {
    let account = req.query.accountId;
    accountServer.getModel(account, (r) => {
        res.send(r);
    });
});


/**
 * 获取用户列表
 */
router.get('/list', function (req, res, next) {
    var role = req.query.role;
    var value = req.query.seachValue;
    accountServer.list(role, value, r => {
        res.json(r);
    })
});

module.exports = router;