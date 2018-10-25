var express = require('express');
var router = express.Router();
const WxSave = require('../common/wx/wx-save');

/**
 * 微信授权
 */
router.get('/', (req, res, next) => {
    console.log('222222');
/*    WxSave.accredit().then(ress=>{
        console.log(ress);
/!*        response.writeHead(200,{"Content-Type":"text/html"});
        response.write(ress.toString());*!/
    })*/
});

router.get('/test', (req, res, next) => {
    let msgSignature = 'cf75c196dc2532c222bccacb6b8a7ec074a0c097',
        timestamp = '1540465774',
        signature = 'c60ffb048a598e09e95bc5737eb81f19c1a0c350',
        nonce = '922414274',
        encrypt_type = 'aes',
        componentVerifyTicket = '',
        createTime = '';

    var postData = {
        appid: 'wx4f68ecdbd31e27e1',
        encrypt: 'jjG6mOScIT1SkiDTjcSzmjsYoCkkLqtHk/dRR5llFywhOg+2m89MIMz6lYK401UzdakZTkkruOz7OSr0X/d2uajgjKzcXWaQa/eyGFyM6NjW/BVDnUDImSibIm85KD0b+sjrN3UoVbv9KSpSpWreyUzLYrbsCPj7thTLwEJGqLgx+o6f5R5i6A+TUu0knsDPMS7PcD3Ce1DsbQgULjhL/3s9mky8+rEn6wFLHpWG/hrCDlzawz94AuWQ6SkD5g7k+367crAfUL3cqKpdB6pp1k08swOz/0GL+/tiKVFZaAEyTxldmXuttL/RZVFUBcO64+uxWGDnrPqCx7KsGZjZoQUlj7braP0hhmKGgZjsyCBzvk80LdA+5YIu+42HZ7igTgnQi2V2h5e99TUiweOYIikrMqcu6QBeO8kVv9iorXn10j3UX13Yl40u/s/3diX2RhOcvLmScw+3jY9Wr9isdQ=='
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

    console.log(postData);
    WxSave.getComponentVerifyTicket(msgSignature, timestamp, signature, nonce, encrypt_type, postData).then(result=>{
        res.send(result);
    })
});
module.exports = router;