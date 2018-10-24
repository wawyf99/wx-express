const sha1 = require('sha1'),
    wechatApi = require('co-wechat-api'),
    config = require('./wechat-config'),
    Jimp = require("jimp"),
    api = new wechatApi(config.WechatConfig.appId, config.WechatConfig.appSecret);


/*微信处理*/
const WxApi = {
    /*生成图像*/
    createImg:(req)=>{
        var code = req;
        return new Promise(function (resolve, reject) {
            resolve(ShowImg.compoundImg(code));
        });
    },
    /*获取分享所需参数*/
    getShareConfig:(_url)=>{
        var _urls = _url;
        var param = {
            debug: false,
            jsApiList: ['onMenuShareAppMessage', 'onMenuShareTimeline'],
            url: _urls,
        };
        return new Promise(function (resolve, reject) {
            api.getJsConfig(param).then(result=> {
                resolve(result);
            });
        });
    }
}

/*图像处理*/
const ShowImg = {
    compoundImg: function (code) {
        return new Promise(function (resolve, reject) {
            Jimp.read("../public/images/share/img.jpg").then(function (image) {
                Jimp.loadFont(Jimp.FONT_SANS_64_BLACK).then(function (font) {
                    image.print(font, 235, 465, code);
                    var file = "../public/images/share/"+code+".jpg";
                    image.write(file);
                    resolve(WxApi.getShareConfig());
                });
            })
        })
    },
}

module.exports = {
    WxApi,
    ShowImg
}