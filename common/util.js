/**
 * 工具类
 */


/**
 * 获取随机数数字
 * @param {number} index 
 * @returns number
 */
exports.getRandom = (index) => {
    let ran = Math.random();
    return ran.toString().substr(2, index);
}