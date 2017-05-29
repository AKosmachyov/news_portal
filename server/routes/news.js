const express = require('express');
const router = express.Router();
const dataBase = require('../database');
const validationService = require('../validationService');
const HttpError = require('../error/HttpError');

router.get('/', function(req, res, next) {
    const count = parseInt(req.query.count, 10);
    let lastId = req.query.id;
    if(isNaN(count) && count < 1 && count > 50)
        return next(new HttpError(400, 'Incorrect range'));

    //TODO Think about other options
    if (lastId) {
        dataBase.generateObjectIdAsync(lastId)
            .then((id) => {
                return dataBase.getNewsByRangeAsync(count, id)
            }).then((arr) =>{
                return res.json(arr);})
            .catch(next);
    } else {
        dataBase.getNewsByRangeAsync(count)
            .then((arr) => res.json(arr))
            .catch(next);
    }
});

router.get('/:id', function(req, res, next) {
    if (!req.params.id)
        return next(new HttpError(400, 'Incorrect data'));

    const newsId = req.params.id;
    dataBase.generateObjectIdAsync(newsId)
        .then((id) => {
            return dataBase.getNewsByQueryAsync({_id:id});
        }).then((news) =>
            res.json(news)
        ).catch(next);
});

router.post('/insert', function(req, res, next) {
    const token = validationService.checkTokeninHeader(req.header('Authorization'));
    if (!token)
        return next(new HttpError(401));

    const news = validationService.createNews(req.body);
    if (!news)
        return next(new HttpError(400, 'Incorrect data'));

    dataBase.getUserIdByTokenAsync(token)
        .then((tokenEntity) => {
            let date = Date.now();
            if (!tokenEntity || new Date(tokenEntity.expiryDate) > date)
                return Promise.reject(new HttpError(401));
            return dataBase.getUserByQueryAsync({_id: tokenEntity.userId});
        }).then((user) => {
            if(!user)
                return Promise.reject(new HttpError(400,'User not found'));
            news.publicationDate = new Date();
            news.author = user;
            return dataBase.insertNewsAsync(news);
        }).then(() => res.send('Success')
    ).catch(next);
});

router.post('/:id/modify', function(req, res, next) {
    const token = validationService.checkTokeninHeader(req.header('Authorization'));
    if(!token)
        return next(new HttpError(401));

    var newsId = req.params.id;
    var userId;
    const news = validationService.createNews(req.body);
    if (!news)
        return next(new HttpError(400, 'Incorrect data'));

    dataBase.generateObjectIdAsync(newsId)
        .then((objectId) => {
            newsId = objectId;
            return dataBase.getUserIdByTokenAsync(token)
        }).then((tokenEntity) => {
            if(!tokenEntity)
                return Promise.reject(new HttpError(401));
            userId = tokenEntity.userId;
            return dataBase.checkPermissionAsync(newsId, tokenEntity.userId);
        }).then((flag) => {
            if (!flag)
                return Promise.reject(new HttpError(400, 'Permission denied'));
            return dataBase.getNewsByQueryAsync({_id: newsId, archived: true});
        }).then((newsDB) => {
            if(newsDB)
                return Promise.reject(new HttpError(400, 'News was archived'));
            return dataBase.getUserByQueryAsync({_id: userId});
        }).then((user) => {
            //TODO Here the owner of the news is changing
            news.author = {
                _id: user._id,
                name: user.name
            };
            news.modifiedDate = new Date();
            return dataBase.modifyNewsAsync(newsId, news);
        }).then(() => res.send('Success'))
        .catch(next);
});

router.get('/:id/archive', function(req, res, next) {
    const token = validationService.checkTokeninHeader(req.header('Authorization'));
    if(!token)
        return next(new HttpError(401));

    var newsId = req.params.id;

    dataBase.generateObjectIdAsync(newsId)
        .then((objectId) => {
            newsId = objectId;
            return dataBase.getUserIdByTokenAsync(token)
        }).then((tokenEntity) => {
            if(!tokenEntity)
                return Promise.reject(new HttpError(401));
            return dataBase.checkPermissionAsync(newsId, tokenEntity.userId)
        }).then((flag) => {
            if(!flag)
                return Promise.reject(new HttpError(400, 'Permission denied'));
            return dataBase.getNewsByQueryAsync({_id: newsId});
        }).then((news) => {
            news.archived = true;
            return dataBase.modifyNewsAsync(newsId, news);
        }).then(() => res.send('Success'))
        .catch(next);
});

module.exports = router;