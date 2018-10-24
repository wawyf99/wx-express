/**
 * 系统配置
 */

//微信配置
exports.WechatConfig = {

    //点海乐玩
    //appId: 'wx8f1f896ca5ff9142', //appId
    //appSecret: '1a9f88282a05998c796d0b7b2d77727f', //appSecret
    //working测试

    appId: 'wx51d1872e4788491d', //appId
    appSecret: 'b0ec281546205564ca0f4a293566def0', //appSecret

    token: 'working', //token

    shareImg : '/public/image/img.jpg',
    /**
     * 微信自动回复内容
     * 1.带url字段为像用户回复带跳转的消息内容
     * 2.不带url字段为像用户回复文本消息
     */
    msg: [
        {
            key: '测试',
            url: 'http://working.rzzc.ltd',
            content: '测试地址'
        }
    ],
    sendurl: [
        {
            key: '代理',
            content: "<a href='http://mj.agent.dh.szdhkj.com.cn/'>《荆州麻将代理后台》</a>\n\n<a href='http://agent.sxmj.szdhkj.com.cn/'>《陕西麻将代理后台》</a>"
        },
        {
            key: '游戏',
            content: "<a href='http://mj.agent.dh.szdhkj.com.cn/download/'>《下载荆州麻将》</a>\n\n<a href='http://agent.sxmj.szdhkj.com.cn/download/'>《下载陕西麻将》</a>"
        },
        {
            key: '商务',
            content: "<a href='http://mj.commerce.dh.szdhkj.com.cn/'>《荆州麻将商务后台》</a>\n\n<a href='http://commerce.sxmj.szdhkj.com.cn/'>《陕西麻将商务后台》</a>"
        }
    ],
    /**
     * authorizeCode:授权模式 正式版使用：true，测试版本统一使用false,
     * 用途:微信授权成功后.像服务器发送code.服务器根据请求参数验证是否将code继续分发.
     * 1.像微信授权回调至正式版后.正式版验证根据请求参数是否需要继续回调.
     * 2.正式版直接拿到code去微信授权.
     * 3.测试版,则需要正式版本继续请求测试版的的地址.将微信授权的code传至测试版
     */
    authorizeCode: true,
    //wechatNotifyUrl ： 微信回调域名
    //wechatNotifyUrl: "http://agentapi.sxmj.szdhkj.com.cn",
    wechatNotifyUrl: "http://working.api.rzzc.ltd",
    //客户端请求地址->适用于前后端分离
    //clientUrl: "http://agent.sxmj.szdhkj.com.cn",
    clientUrl: "http://working.rzzc.ltd",
    //商户ID->微信支付
    machId: 1502816481,
    //支付key
    payKey: 'd395cc14b3aadd2dc1cbb1ca71cb7c3e',
    //支付回调地址
    notifyUrl: 'http://kunjust.imwork.net/wechat/notify',
    //访问当前站点的地址
    //currentSiteUrl: "http://agentapi.sxmj.szdhkj.com.cn",
    currentSiteUrl: "http://working.api.rzzc.ltd",
    //dubug 调试模式下是否启用固定openid，false为授权获取动态openid，true为固定使用openid。前端开发调试下必须设置为true
    dubug: false,
    //调试模式下的openid
    openid: 'oEGnA1WthSP5hvAg6nf1gsz-UT0s'
};