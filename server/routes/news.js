const express = require('express');
const router = express.Router();
const dataBase = require('../database');

router.get('/', function(req, res, next) {
    let from = parseInt(req.query.from, 10);
    let to = parseInt(req.query.to, 10);
    if(isNaN(from) || isNaN(to) || from >= to || from < 0 || to < 0) {
        res.send('Incorrect range', 400);
        return;
    }
    dataBase.getNewsByRange(from, to).then((data)=>{
        res.json(data);
    }).catch(()=>{
        res.send('Err');
    });

});
router.get('/:id', function(req, res, next) {
    res.send('not ready');
});
router.post('/insert', function(req, res, next) {
    res.send('not ready');
});
router.post('/modify', function(req, res, next) {
    res.send('not ready');
});

module.exports = router;