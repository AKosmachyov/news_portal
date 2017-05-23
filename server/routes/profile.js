const express = require('express');
const router = express.Router();
const dataBase = require('../database');

router.post('/login', function(req, res, next) {
    if (!isValidUserLogin(req.body)) {
        res.send('User entity is incorrect', 400);
        return;
    }
    req.body.login = req.body.login.toLowerCase();

    dataBase.logInAsync(req.body).then((user)=>{
        res.json({
            name: user.name,
            _id: user._id,
            token: user.token
        });
    }).catch((err)=> {
        res.send("The user name and password don't match", 400);
    });
});
router.post('/checkin', function(req, res, next) {
    if (!isValidUserCheckIn(req.body)) {
        res.send('User entity is incorrect', 400);
        return;
    }
    req.body.login = req.body.login.toLowerCase();

    dataBase.checkInAsync(req.body).then((user)=>{
        res.json({
            _id: user._id,
            token: user.token
        });
    }).catch((err)=> {
        res.send(err, 400);
    });
});
function isValidUserCheckIn(user) {
    return (user && isValidLogin(user.login) && user.name && user.password);
}
function isValidUserLogin(user){
    return (user && isValidLogin(user.login) && user.password)
}
function isValidLogin(login) {
    return (/\S+@\S+\.\S+/).test(login);
}

module.exports = router;