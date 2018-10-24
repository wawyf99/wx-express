/**
 * 角色路由类
 */

const express = require('express');
const router = express.Router();
const roleServer = require('../server/role-server');
const roleLinkServer = require('../server/roleLink-server');
const linkServer = require('../server/link-server');

/**
 * 添加角色
 * @returns {arr<t_link>} 返回链接数据对象
 */
router.post('/add', function (req, res, next) {
    let name = req.body.name; //角色名称
    let linkData = req.body.data; //获取角色权限
    roleServer.addRole(name, linkData, result => {
        res.send(result);
    });
});

/**
 * 添加角色权限
 */
router.post('/addrolelink', (req, res, next) => {
    var obj = req.body.data;
    roleLinkServer.addRoleLink(obj, (r) => {
        res.send(r);
    });
});

/**
 * 获取角色列表
 */
router.get('/list', function (req, res, next) {
    roleServer.findAll(result => {
        res.json(result);
    });
})

/**
 * 获取链接列表
 */
router.get('/linklist', function (req, res, next) {
    linkServer.findAll(r => {
        res.send(r);
    });
});

/**
 * 获取链接列表
 */
router.post('/del', function (req, res, next) {
    var roleId = req.body.roleId;
    roleServer.delete(roleId, (r) => {
        res.json(r);
    });
});

/**
 * 获取当前管理员身份
 */
router.get('/getRole', function (req, res, next) {
    var uid = req.query.uid;
    roleServer.getRole(uid, (r) => {
        res.json(r);
    });
});


module.exports = router;