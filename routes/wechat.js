var express = require('express');
var router = express.Router();
const WxSave = require('../common/wx/wx-save');
const wechatServer = require('../server/wechat-server');

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
    let msg_signature = 'cf094ce189e57cea0c4744e9eb8878e9263c2fdf',
        timestamp = '1540550377',
        signature = 'e980e6803865dc756d586ae818ac6d0b1194e1ed',
        nonce = '373781067',
        encrypt_type = 'aes',
        componentVerifyTicket = '',
        createTime = '';

    var postData = {
        appid: 'wx7566be2c0098c99c',
        encrypt: 'EKFt9mGrdCFDSJy5npheLyu1HGS2pFKO8Dx2z6inXF7KfWAqc6TN/5GI9Zc0M/rqgwexVSqtgyMrudhN0uDWBkg3p0KS0qUD+Q+NFp/1RoLPV/vltGoVbZUbAcseFcXb9tWVp4BLWUtHBqnjnHNyu0Gl+bQIQIQINi9M/RngXunChky0htwKPsSlqzgVv4K9Gvppa9k6EOm+fAq++ebXYqbWifiSFqz7KHlUpM87dYSc4y3AR3W31fqkpa7IqX08yKl1VPOnaSX+hEP4NkGPo0OdgV6XKNU1Unq0ElKZBt4sEHSG3CvjbUjPsh9UKznV00gzzCLhzYc809cg54CybY4isKlTsdZ3+kBNEYJQFaYB3cjps6+NCLCnzuTBtz+f8oYXrxhi0uSTPW5fbEwwHR5DiWwJiw0xmexlKlkVf4usRiNWJ92EhYg/PcqB0JXmIVCJ+BTbiyLRLSGjN1h6QQ=='
    };
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
router.get('/tests', (req, res, next) => {
    WxSave.accredit().then(res=>{
        console.log(res);
    })
});
router.get('/redisWrite',(req,res,next) => {
    let appid = 'wx7566be2c0098c99c';

    wechatServer.getWxId(appid, result => {
        console.log(result);
        res.send(result.id);
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
    console.log(postData);
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

//更新token
router.post('/updateToken', function(req, res, next) {
    let AppId = req.body.AppId,
        AuthCode = req.body.AuthCode;
    WxSave.getAuthorizerToken(AppId, AuthCode).then(result=>{
        res.send(result);
    })
});

module.exports = router;