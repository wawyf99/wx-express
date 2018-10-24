/**
 * 微信过滤器
 */
const wechat = require('./wechat-config');
const sha1 = require('sha1');
const wechatFilter = {
    checkSignature: () => {
        return (req, res, next) => {
            let signature = req.query.signature, //签名
                timestamp = req.query.timestamp, //时间戳
                nonce = req.query.nonce, //随机数
                echostr = req.query.echostr; //随机字符串  
            let str = [wechat.WechatConfig.token, timestamp, nonce].sort().join('');
            let sha = sha1(str);
            if (req.method == "GET") {
                console.log(sha == signature)
                if (sha == signature) {
                    res.send(echostr + '');
                } else {
                    res.send('check sign err');
                }
            } else if (req.method == "POST") {
                if (sha != signature) {
                    return;
                }
                next();
            }
        }
    }
};

module.exports = wechatFilter;