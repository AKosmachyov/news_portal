const express = require('express');
const router = express.Router();
const dataBase = require('../database');

router.post('/login', function(req, res, next) {
    if (!isValidUserLogin(req.body)) {
        res.send('User entity is incorrect', 400);
        return;
    }
    dataBase.logIn(req.body).then((name)=>{
        res.json({name: name});
    }).catch((err)=> {
        res.send("The user name and password don't match", 400);
    });
});
router.post('/checkin', function(req, res, next) {
    if (!isValidUserCheckIn(req.body)) {
        res.send('User entity is incorrect', 400);
        return;
    }
    dataBase.checkIn(req.body).then(()=>{
        res.send('success', 200);
    }).catch((err)=> {
        res.send('This login is already registered.', 400);
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