const sha1 = require('sha1'),
    wechatServer = require('../../server/wechat-server'),
    wechatApi = require('co-wechat-api'),
    config = require('./wechat-config'),
    api = new wechatApi(config.WechatConfig.appId, config.WechatConfig.appSecret);

const wechatUtil = {
    /**
     * 处理微信发送的消息业务
     * @param {object} obj->消息对象
     */
    receiveMessage: (obj) => {
        var msg = {
            openid: obj.senderId,
            content: obj.content
        };
        wechatUtil.sendMsg(msg);
    },

    /**
     * 处理微信发送的消息业务
     * @param {object} obj->事件对象
     */
    receiveEvent: (obj) => {
        switch (obj.event) {
            //关注事件
            case 'subscribe':
                console.log('进入:subscribe');
                responseApi.getUser(obj.senderId).then(result => {
                    wechatServer.subscribe(obj.senderId, result);
                });
                break;
            //取消关注
            case 'unsubscribe':
                console.log('进入:unsubscribe');
                break;
            //自定义菜单点击事件
            case 'CLICK':
                console.log('进入:CLICK');
                responseApi.sendUrl(obj.eventKey, obj.senderId);
                break;
            //关注后扫描二维码事件
            case 'SCAN':
                console.log('进入:SCAN');
                break;
            //上报地理位置
            case 'LOCATION':
                console.log('进入:LOCATION');
                break;
            //点击菜单跳转链接事件
            case 'VIEW':
                console.log('进入:VIEW');
                break;
            default:
                break;
        }
    },

    /**
     * 发送消息
     * @param {object} obj
     */
    sendMsg: function (obj) {
        let msglist = config.WechatConfig.msg;
        //搜索用户发送的关键字
        msglist.find((value, index, arr) => {
            if (obj.content === value.key) {
                //像用户发送带url跳转的消息
                if (value.url !== '') {
                    obj.content = '<a href="' + value.url + '">' + value.content + '</a>';
                }
                //像用户发送文字消息
                else {
                    obj.content = value.content;
                }
                responseApi.sendText(obj);
            }
        });
    },

};

//响应微信消息事件api1
const responseApi = {
    //发送文本消息
    sendText: function (obj) {
        api.sendText(obj.openid, obj.content);
    },
    //发送链接
    sendUrl: function(key, opendId){
        var _str = config.WechatConfig.sendurl;
        switch (key) {
            case 'BTN0001':
                _str.find((value, index, arr) => {
                    if (value.key == '代理') {
                        api.sendText(opendId, value.content);
                    }
                })
                break;
            case 'BTN0002':
                _str.find((value, index, arr) => {
                    if (value.key == '游戏') {
                        api.sendText(opendId, value.content);
                    }
                })
                break;
            case 'BTN0003':
                _str.find((value, index, arr) => {
                    if (value.key == '商务') {
                        api.sendText(opendId, value.content);
                    }
                })
                break;
        }
    },
    //获取用户信息
    getUser: function (openid) {
        return api.getUser(openid);
    },
    //创建临时二维码
    createTmpQRCode: function (uid) {
        return new Promise(function (resolve, reject) {
            //创建临时二维码
            api.createTmpQRCode(uid, 2592000).then(result => {
                resolve(api.showQRCodeURL(result.ticket));
            });
            //创建永久二维码
            // api.createLimitQRCode(uid).then(result => {
            //     console.log(result);
            //     resolve(api.showQRCodeURL(result.ticket));
            // });
        });
    },
};

//微信消息事件对象
const wechat = {
    type: '', //消息类型
    //接收微信发送的消息参数
    messageParameter: {
        senderId: 0, //获取或设置发送方ID。（微信 OpenId）
        messageId: 0, //获取或设置消息ID。
        messageType: '', //获取或设置消息类型。
        content: '', //获取或设置消息内容。
        createtime: 0, //获取或设置创建时间。
    },
    //接收微信发送的时间参数
    eventParameter: {
        senderId: 0, //获取或设置发送方ID。（微信 OpenId）
        event: '', //获取或设置事件类型。
        eventKey: '', //获取或设置消息类型。
        Ticket: '', //获取或设置二维码的Ticket。
        createtime: 0, //获取或设置创建时间。
        latitude: 0, //经度
        longitude: 0, //纬度
    },
    //解析来自微信发送的消息
    loop: function (req) {
        return new Promise(function (resovle, reject) {
            var self = this;
            var buf = '';
            var wechatMsg = req.body.xml;
            switch (wechatMsg.msgtype) {
                case 'text':
                    self.type = 'text';
                    self.messageParameter = {
                        senderId: wechatMsg.fromusername,
                        createtime: wechatMsg.createtime,
                        messageType: wechatMsg.msgtype,
                        content: wechatMsg.content,
                        messageId: wechatMsg.msgid
                    }
                    break;
                default:
                    self.type = 'event';
                    self.eventParameter = {
                        senderId: wechatMsg.fromusername,
                        event: wechatMsg.event,
                        eventKey: wechatMsg.eventkey ? wechatMsg.eventkey : null,
                        Ticket: wechatMsg.ticket ? wechatMsg.ticket : null,
                        createtime: wechatMsg.createtime,
                        latitude: wechatMsg.location_x ? wechatMsg.location_x : null,
                        longitude: wechatMsg.location_y ? wechatMsg.location_y : null,
                    }
                    break;
            }
            resovle(self);
        }).catch(err => {
            console.log(err);
            reject(err);
        });
    },
    checkSignature: (req) => {
        this.signature = req.query.signature;
        this.timestamp = req.query.timestamp;
        this.nonce = req.query.nonce;
        this.echostr = req.query.echostr;
        this.token = config.WechatConfig.token;

        var array = [this.token, this.timestamp, this.nonce];
        array.sort();

        var str = sha1(array.join(""));
        return (str == this.signature)
    }
};

module.exports = {
    wechat,
    responseApi,
    wechatUtil
}