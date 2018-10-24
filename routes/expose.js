var express = require('express');
var router = express.Router();
const exposeServer = require('../server/expose-server');

/* 暴露域名*/
router.get('/exportDomain', function(req, res, next) {
    //console.log(req.body);
    let id = req.query.id;
    if(id){
        exposeServer.detectionDomain(id, result => {
            res.send(result.data);
        });
    }else{
        exposeServer.exportDomain(result => {
            res.send(result.data);
        });
    }

});

module.exports = router;