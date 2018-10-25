var express = require('express');
var router = express.Router();
const WxSave = require('../common/wx/wx-save');

/**
 * 微信授权
 */
router.get('/', (req, res, next) => {
    WxSave.accredit().then(ress=>{
        res.send(ress);
    })
});

router.get('/test', (req, res, next) => {
    let msgSignature = '3485956fb1299a32a82e4fd986ae318ce7ab43f6',
        timestamp = '1540489338',
        signature = '6532ea6c26a978c0207abeca883cca808cd4a29f',
        nonce = '450284446',
        encrypt_type = 'aes',
        componentVerifyTicket = '',
        createTime = '';

    var postData = {
        appid: 'wx4f68ecdbd31e27e1',
        encrypt: 'LOQ8DTZi4+1sZD7uGyt08pyZKtRhIIvmESeMYhul6elPZwvFw3cx4UyJvaVo6+6bHo+CUNKErg5a2Z64/FFCRFsYFpWYT7GxuAALz7xPZr6F0q2HZ5XoE8yq45CIDKfz01p+b5jFy68hOmX8VZ3FNKrNC+11cP2TkdbMCRgNLHOW368ZTxVdE7XQRw35iRLl2TchSHuNVnoKsdk2sO3r8JlzUNsSNDKqA6SLiXYgu0f19b2Z0WmQDei45GLg5x7SXqq+neMV5qXvIpTeUUI4jhfjWNY/LFFFm0yMammrOUSjEOB2DFPcMVqkQhnUx+DuxGALHAhBkfILHsROwGaAARYNnsoNmQbeMMofjOL397KMDGJJT+jxuD/ssLP6wzJL7e2Og7UaXaeiHFSP2+ZGvovep0gF3FIBVWl/z+DYbmab0wgu0N9Tnck5kd3J4HQObpf6CJ6teiC7HmNNCy3yFA=='
    };
    WxSave.getComponentVerifyTicket(msgSignature, timestamp, signature, nonce, encrypt_type, postData).then(result=>{
        res.send(result);
    })
});
router.get('/tests', (req, res, next) => {
    WxSave.accredit().then(res=>{
        console.log(res);
    })
});
router.get('/redisWrite',(req,res,next) => {
    WxSave.setRedis().then(res=>{
        console.log(res);
    })
})

//微信事件推送的入口
router.post('/receive', function(req, res, next) {
    //获取参数
    let msgSignature = req.query.msgSignature,
        timestamp = req.query.timestamp,
        signature = req.query.signature,
        nonce = req.query.nonce,
        encrypt_type = req.query.encrypt_type;
    let postData = req.body.xml;
    WxSave.getComponentVerifyTicket(msgSignature, timestamp, signature, nonce, encrypt_type, postData).then(result=>{
        res.send(result);
    })
});
module.exports = router;