const express = require('express');
const router = express.Router();
const dataBase = require('../database');
const validationService = require('../validationService');
const HttpError = require('../error/HttpError');

router.post('/login', function(req, res, next) {
    const user = validationService.createUserForLogIn(req.body);
    if (!user)
        return next(new HttpError(400, 'User entity is incorrect'));

    dataBase.getUserByQueryAsync(user)
        .then((data) => {
            if(!data)
                return Promise.reject(new HttpError(400, "The user name and password don't match"));
            user._id = data._id;
            user.name = data.name;
            if (data.userType)
                user.userType = data.userType;
            return dataBase.generateTokenAsync();
        }).then((token) => {
            return dataBase.insertTokenAsync(user._id, token);
        }).then((status) => {
            if(status.insertedCount != 1)
                return Promise.reject(new HttpError(500));
            let obj = {
                _id: status.ops[0].userId,
                token: status.ops[0].token,
                name: user.name
            };
            if (user.userType)
                obj.userType = user.userType;
            res.json(obj);
        }).catch(next);
});

router.post('/checkin', function(req, res, next) {
    const user = validationService.createUserForCheckIn(req.body);
    if (!user)
        return next(new HttpError(400, 'User entity is incorrect'));

    dataBase.getUserByQueryAsync({login: user.login})
        .then((data) => {
            if(data)
                return Promise.reject(new HttpError(400, 'This user is already exist'));
            return dataBase.checkInAsync(user);
        }).then((status) => {
            if(status.insertedCount != 1)
                return Promise.reject(new HttpError(500));
            user._id = status.ops[0]._id;
            return dataBase.generateTokenAsync();
        }).then((token) => {
            return dataBase.insertTokenAsync(user._id, token)
        }).then((status) => {
            if(status.insertedCount != 1)
                return Promise.reject(new HttpError(500));
            res.send({
                _id: status.ops[0].userId,
                token: status.ops[0].token
            })
        }).catch(next);
});

module.exports = router;