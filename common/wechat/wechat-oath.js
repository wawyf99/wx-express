const config = require('../wechat/wechat-config'),

    OAuth = require('co-wechat-oauth'),
wechatServer = require('../../server/wechat-server');

const oauth = new OAuth(config.WechatConfig.appId, config.WechatConfig.appSecret);


/**
 * 微信网页授权
 */
const wechatAuthentication = {
    //微信凭证
    authenticationUtility: function (req) {
        return new Promise(function (resolve, reject) {
            // var openid = '';
            // //debug模式直接使用死的openid
            // if (!config.WechatConfig.authorizeCode && !config.WechatConfig.dubug)
            //     openid = config.WechatConfig.openid;

            // if (openid && openid !== ""){
            //     //dubug 模式不重定向当前页面
            //     if (config.WechatConfig.authorizeCode)
            //     {
            //         var url = string.Format("{0}?t={1}", context.Request.Url, new Random().Next());
            //         // 刷新当前页
            //         return new RedirectResult(url);
            //     }
            // }

            var referrerUrl = '';
            referrerUrl = config.WechatConfig.wechatNotifyUrl;

            //// 由于地址栏Url如果带#, #后面的字符无法传递到服务器
            //// 在第一个#后面出现的任何字符，都会被浏览器解读为位置标识符。这意味着，这些字符都不会被发送到服务器端。
            //// 而现有用户端是Vue单页程序,如果要通过菜单跳转到某个指定页,则后面必须带#,如果用户已经授权过公众号,此种方式没有问题, 而没有授权时, 则需要Redirect到微信去进行授权, 此时#后面的内容会丢失, 导致用户第一次进去无论点哪都只能到首页. 所以采用hash来传递需要跳转的具体路由
            // 将当前URL作为跳转参数进行授权跳转
            // 如：http://user.quanxinshenghuo.net/gateway/wechat?type=authorize&url=http://user.quanxinshenghuo.net/wechat/usercenter
            // 公众号支持多URL跳转。将正式授权回调URL固定为正式版url
            //var url = config.WechatConfig.wechatNotifyUrl + "/wechat/gateway?url=" + config.WechatConfig.wechatNotifyUrl + '/wechat/wechat-login&pattern=' + config.WechatConfig.authorizeCode;
            var url = config.WechatConfig.wechatNotifyUrl + "/sxmj/wechat/gateway?url=" + config.WechatConfig.wechatNotifyUrl + '/sxmj/wechat/wechat-login&pattern=' + config.WechatConfig.authorizeCode;

            var result = oauth.getAuthorizeURL(url, '', 'snsapi_userinfo');
            resolve(result);
        });

    },
    authorization: function(_accountId, _clubId, req){
        return new Promise(function (resolve, reject) {
            var _url = config.WechatConfig.wechatNotifyUrl + "/sxmj/wechat/junmpLink?url=" + config.WechatConfig.clientUrl + '/friendsCircle&accountId='+ _accountId + '&clubId='+_clubId;
            var result = oauth.getAuthorizeURL(_url, '', 'snsapi_userinfo');
            resolve(result);
        })
    },
    //授权接收code处理
    authenticationCodes: function (code) {
        return new Promise(function (resolve, reject) {
            oauth.getUserByCode(code).then(res => {
                /*if (res) {
                    wechatServer.subscribe(res.openid, res);
                }*/
                wechatServer.findByOpenId(res.unionid, result => {
                    resolve(res.unionid);
                })
            });
        })
    },
    //授权接收code处理
    authenticationCode: function (code) {
        return new Promise(function (resolve, reject) {
            oauth.getUserByCode(code).then(res => {
                /*if (res) {
                    wechatServer.subscribe(res.openid, res);
                }*/
                wechatServer.findByOpenId(res.unionid, result => {
                    resolve(res.unionid);
                })
            });
        }).catch(e => {
            reject(e);
        });
    }
}
module.exports = {
    wechatAuthentication
}