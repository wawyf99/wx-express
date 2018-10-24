var express = require('express');
var router = express.Router();



/**
 * 测试接口
 */
router.get('/', (req, res, next) => {
    res.send('1234567');
});

module.exports = router;