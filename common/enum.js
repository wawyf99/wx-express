/**
 * 枚举文件
 */

const Enum = {
    //用户类型枚举
    UserType: {
        COMMERCE: 1, //商务人员
        BAZAAR: 2, //市场经理
        properties: {
            1: {
                name: '商务人员',
                value: 1
            },
            2: {
                name: '市场经理',
                value: 2
            },

        }
    },
    //账号来源
    AccountSource: {
        COMMERCE: 1, //商务后台
        OPERATION: 2, //运营后台
        properties: {
            1: {
                name: '商务后台',
                value: 1
            },
            2: {
                name: '运营后台',
                value: 2
            }
        }
    },
    
    //代理等级
    AgentLevel: {
        PAXOS: 1, //预备代理
        ORDINARY: 2, //普通代理
        COPER: 3, //铜牌代理
        SILVER: 4, //银牌代理
        GOLD: 5, //金牌代理
        properties: {
            1: {
                name: '预备代理',
                value: 1,
                upgrade: { //升级条件
                    bindPlayer: 0, //绑定玩家数量
                    totalRecharge: 0, //累计充值
                    subordinateAgent: 0, //下级代理
                    directRebate: 0.45, //直属返利
                    subordinateRebate: 0, //下级返利
                    minimumRecharge: 0, //最低充值
                }
            },
            2: {
                name: '普通代理',
                value: 2,
                upgrade: { //升级条件
                    bindPlayer: 15, //绑定玩家数量
                    totalRecharge: 0, //累计充值
                    subordinateAgent: 0, //下级代理
                    directRebate: 0.45, //直属返利
                    subordinateRebate: 0.07, //下级返利
                    minimumRecharge: 0, //最低充值
                }
            },
            3: {
                name: '铜牌代理',
                value: 3,
                upgrade: { //升级条件
                    bindPlayer: 30, //绑定玩家数量
                    totalRecharge: 9000, //累计充值
                    subordinateAgent: 2, //下级代理
                    directRebate: 0.5, //直属返利
                    subordinateRebate: 0.08, //下级返利
                    minimumRecharge: 0, //最低充值
                }
            },
            4: {
                name: '银牌代理',
                value: 4,
                upgrade: { //升级条件
                    bindPlayer: 60, //绑定玩家数量
                    totalRecharge: 18000, //累计充值
                    subordinateAgent: 3, //下级代理
                    directRebate: 0.55, //直属返利
                    subordinateRebate: 0.09, //下级返利
                    minimumRecharge: 0, //最低充值
                }
            },
            5: {
                name: '金牌代理',
                value: 5,
                upgrade: { //升级条件
                    bindPlayer: 100, //绑定玩家数量
                    totalRecharge: 36000, //累计充值
                    subordinateAgent: 5, //下级代理
                    directRebate: 0.6, //直属返利
                    subordinateRebate: 0.1, //下级返利
                    minimumRecharge: 0, //最低充值
                }
            },
        }
    },
};

module.exports = Enum;