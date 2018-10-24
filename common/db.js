var Sequelize = require("sequelize");

//数据库链接配置
const dbConfig = {
    //游戏数据库配置
    express: {
        host: '45.77.129.113',
        db: 'express',
        uid: 'wawyf99',
        pwd: 'Wi8FmXiTNwC4sKYX',
        dialect: 'mysql',
        port: 3306,
    },
};

const connection = function (type) {
    var sequelize;
    if (type === 'express') {
        sequelize = new Sequelize(dbConfig.express.db, dbConfig.express.uid, dbConfig.express.pwd, {
            host: dbConfig.express.host, //数据地址
            dialect: dbConfig.express.dialect, //数据库类型
            port: dbConfig.express.port, //数据端口
            pool: {
                max: 5, // 连接池中最大连接数量
                min: 0, // 连接池中最小连接数量
                idle: 10000 // 如果一个线程 10 秒钟内没有被使用过的话，那么就释放线程
            },
            dialectOptions: {
                charset: 'utf8_general_ci',
                multipleStatements: true
            },
            define: {
                timestamps: false
            },
            timezone: '+08:00' //东八时区
        });
    }
    return sequelize;
};
module.exports = connection;