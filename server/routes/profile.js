const express = require('express');
const router = express.Router();
const dataBase = require('../database');

// id: number;
// login: string;
// password: string;
// name: string;
router.post('/login', function(req, res, next) {
    res.send('not ready');
});
router.post('/checkin', function(req, res, next) {
    dataBase.checkIn(req.body).then(()=>{
        res.send('success', 200);
    }).catch((err)=> {
        console.error(err);
        res.send('error', 500);
    });
});

module.exports = router;