const express = require('express');
const router = express.Router();
const dataBase = require('../database');
const validationService = require('../validationService');

router.post('/login', function(req, res, next) {
    const user = validationService.createUserForLogIn(req.body);
    if (!user) {
        res.send('User entity is incorrect', 400);
        return;
    }
    dataBase.getUserByQueryAsync(user)
        .then((data) => {
            if(!data)
                return Promise.reject("The user name and password don't match");
            user._id = data._id;
            user.name = data.name;
            return dataBase.generateTokenAsync();
        }).then((token) => {
            return dataBase.insertTokenAsync(user._id, token);
        }).then((status) => {
            if(status.insertedCount != 1)
                return Promise.reject("Server error");
            res.send({
                _id: status.ops[0].userId,
                token: status.ops[0].token,
                name: user.name
            })
        }).catch((error) => {
            let err = new Error(error);
            err.status = 400;
            next(err);
    });
});

router.post('/checkin', function(req, res, next) {
    const user = validationService.createUserForCheckIn(req.body);
    if (!user) {
        res.send('User entity is incorrect', 400);
        return;
    }
    dataBase.getUserByQueryAsync({login: user.login})
        .then((data) => {
            if(data)
                return Promise.reject('This user is already exist');
            return dataBase.checkInAsync(user);
        }).then((status) => {
            if(status.insertedCount != 1)
                return Promise.reject("Server error");
            user._id = status.ops[0]._id;
            return dataBase.generateTokenAsync();
        }).then((token) => {
            return dataBase.insertTokenAsync(user._id, token)
        }).then((status) => {
            if(status.insertedCount != 1)
                return Promise.reject("Server error");
            res.send({
                _id: status.ops[0].userId,
                token: status.ops[0].token
            })
        }).catch((error) => {
            let err = new Error(error);
            err.status = 400;
            next(err);
    })
});

module.exports = router;