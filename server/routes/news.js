const express = require('express');
const router = express.Router();
const dataBase = require('../database');
const validationService = require('../validationService');

router.get('/', function(req, res) {
    const count = parseInt(req.query.count, 10);
    let lastId = req.query.id;
    if(isNaN(count) && count < 1 && count > 50) {
        res.send('Incorrect range', 400);
        return;
    }
    //TODO Think about other options
    if (lastId) {
        dataBase.generateObjectIdAsync(lastId)
            .then((id) => {
                return dataBase.getNewsByRangeAsync(count, id)
            }).then((arr) =>{
                return res.json(arr);})
            .catch((err) => {
                    res.send('Bad id', 400);
            });
    } else {
        dataBase.getNewsByRangeAsync(count)
            .then((arr) => res.json(arr))
            .catch((err) => {
                res.send('Error', 500);
        });
    }
});

router.get('/:id', function(req, res) {
    if (!req.params.id) {
        res.send('Incorrect data', 400);
        return;
    }
    const newsId = req.params.id;
    dataBase.generateObjectIdAsync(newsId)
        .then((id) => {
            return dataBase.getNewsByQueryAsync({_id:id});
        }).then((news) =>
            res.json(news)
        ).catch((err) =>
            res.send(err, 404))
});

router.post('/insert', function(req, res, next) {
    const token = validationService.checkTokeninHeader(req.header('Authorization'));
    if (!token) {
        res.send('Unauthorized ', 401);
        return;
    }
    const news = validationService.createNews(req.body);
    if (!news) {
        res.send('Incorrect data', 400);
        return;
    }

    dataBase.getUserIdByTokenAsync(token)
        .then((tokenEntity) => {
            let date = Date.now();
            if (!tokenEntity || new Date(tokenEntity.expiryDate) > date)
                return Promise.reject('Unauthorized');
            return dataBase.getUserByQueryAsync({_id: tokenEntity.userId});
        }).then((user) => {
            if(!user)
                return Promise.reject('User not found');
            news.publicationDate = new Date();
            news.author = user;
            return dataBase.insertNewsAsync(news);
        }).then(() => res.send('Success')
    ).catch((error) => {
        let err = new Error(error);
        err.status = error == 'Unauthorized' ? 401 : 500;
        next(err);
    });
});

router.post('/:id/modify', function(req, res, next) {
    const token = validationService.checkTokeninHeader(req.header('Authorization'));
    if(!token){
        res.send('Unauthorized ',401);
        return;
    }
    var newsId = req.params.id;
    const news = validationService.createNews(req.body);
    if (!news) {
        res.send('Incorrect data', 400);
        return;
    }
    dataBase.generateObjectIdAsync(newsId)
        .then((objectId) => {
            newsId = objectId;
            return dataBase.getUserIdByTokenAsync(token)
        }).then((tokenEntity) => {
            if(!tokenEntity)
                return Promise.reject('Unauthorized');
            return dataBase.getNewsByQueryAsync({
                _id: newsId,
                'author._id': tokenEntity.userId
            })
        }).then(() => {
            news.modifiedDate = new Date();
            return dataBase.modifyNewsAsync(newsId, news);
        }).then(() => res.send('Success'))
        .catch((error) => {
            let err = new Error(error);
            err.status = 500;
            if (err == 'Unauthorized')
            if (err == 'News not found')
                err.status = 404;
            next(err);
    });
});

module.exports = router;