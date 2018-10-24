/**
 * 阿里云短信服务
 * kunjust
 */

//阿里云Access
var accessKeyId = "LTAI14KMnKCqxLDx";

var secretAccessKey = "64kl6G7XOuVDO6kJfaiB2eFbFkCDGL";

const SMSClient = require('@alicloud/sms-sdk')

//初始化sms_client
let smsClient = new SMSClient({
    accessKeyId,
    secretAccessKey
});

exports.SendSMS = (code, phone, callback) => {
    //发送短信
    smsClient.sendSMS({
        PhoneNumbers: phone,
        SignName: '点海科技',
        TemplateCode: 'SMS_126464525',
        TemplateParam: '{"code":"' + code + '"}'
    }).then(function (res) {
        let {
            Code
        } = res;
        if (Code === 'OK') {
            //处理返回参数
            callback(res);
        }
    }, function (err) {
        callback(err);
    });
}