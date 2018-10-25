var express = require('express');
var router = express.Router();
const WxSave = require('../common/wx/wx-save');

/**
 * 微信授权
 */
router.get('/', (req, res, next) => {
    WxSave.accredit().then(ress=>{
        console.log(ress);
    })
});

router.get('/test', (req, res, next) => {
    let msgSignature = '9d60c092a4f3cdf5d3d3e91988d8837faa8c49d7',
        timestamp = '1540488635',
        signature = '38815545c417670114baccb54efa531f90dd3a28',
        nonce = '1706396482',
        encrypt_type = 'aes',
        componentVerifyTicket = '',
        createTime = '';

    var postData = {
        appid: 'wx4f68ecdbd31e27e1',
        encrypt: 'm+oHJROf1xW0Q6qR0nIGhGknk8QmvfhIasbAkKGhnkUkVj0Lui3FyqeDWJB7x9EIsEs1BXpaCEmBVeKyFbIjBFJSjjjVjvYqk6O9cZ740HNqMpVLeYYVyuBCan299IO0n8ELhV8NwKV2iqYy3L7ubBxr59o0DT+/8H8yPDuZQMO6wmlgDH7j5o5ohJOu+7kK8HxavsYdq0vvEf6qgho71z9BJ25T8iYZiHFl21e5HxUIkbTkiLLIKVqqVDFAV300b0qJhbpz0c0im0l8HeLHuPf28qox60i7kUfbI90guHp+NgSgm97KfQf9Ws2p8j33DC/EA8kD0wtSPM5wh3VM8J3lHBkptIc/aEKTkq2pMORseDGn6ZxOtMtKKO/gn9kfh3QXYp87p/J3VxKW6C28UiZhqI9LRHCc7vsED5SsKewpy1PiIdJ53Z7lwd/gB0LhnWeGQyJCAwMrj/O1XknBjA=='
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