const express = require('express');
const router = express.Router();
const dataBase = require('../database');
const validationService = require('../validationService');

router.get('/', function(req, res) {
    let from = parseInt(req.query.from, 10);
    let to = parseInt(req.query.to, 10);
    if(isNaN(from) || isNaN(to) || from >= to || from < 0 || to < 0) {
        res.send('Incorrect range', 400);
        return;
    }
    dataBase.getNewsByRangeAsync(from, to).then((data)=>{
        res.json(data);
    }).catch((err)=>{
        res.send('Error');
    });

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
            console.log(tokenEntity.userId);
            return dataBase.getUserByQueryAsync({_id: tokenEntity.userId});
        }).then((user) => {
            if(!user)
                return Promise.reject('User not found');
            console.log(user._id);
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