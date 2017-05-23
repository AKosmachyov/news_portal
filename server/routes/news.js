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
    dataBase.getNewsByRangeAsync(from, to).then((data)=>{
        res.json(data);
    }).catch(()=>{
        res.send('Error');
    });

});
router.get('/:id', function(req, res, next) {
    if (!req.params.id) {
        res.send('Incorrect data', 400);
        return;
    }
    dataBase.getNewsByIdAsync(req.params.id)
        .then((news) =>
            res.json(news)
        ).catch((err) =>
            res.send(err, 404))
});
router.post('/insert', function(req, res, next) {
    let token = checkToken(req.header('Authorization'));
    if(!token){
        res.send('Unauthorized ',401);
        return;
    }
    if (!isValidNews(req.body)) {
        res.send('Incorrect data', 400);
        return;
    }
    dataBase.getUserByTokenAsync(token)
        .then((user) => {
            let news = req.body;
            news.publicationDate = new Date();
            news.author = user;
            return dataBase.insertNewsAsync(news)
        }, () => res.send('Unauthorized ',401))
        .then(() => res.send('Success'))
        .catch(() => res.send('News not added', 400))
});
router.post('/:id/modify', function(req, res, next) {
    let token = checkToken(req.header('Authorization'));
    if(!token){
        res.send('Unauthorized ',401);
        return;
    }
    let id = req.params.id;
    if (!isValidNews(req.body) && !id) {
        res.send('Incorrect data', 400);
        return;
    }
    dataBase.getUserByTokenAsync(token)
        .then((user) => {
            let news = req.body;
            if(news.author._id != user._id)
                return Promise.resolve('Access is denied');
            news.modifiedDate = new Date();
            news.author = user;
            return dataBase.modifyNewsAsync(news)
        }, () => res.send('Unauthorized ',401))
        .then(() => res.send('Success'))
        .catch((err) => res.send(err, 400));
});
function checkToken(strToken) {
    if(!strToken)
        return false;
    let token = strToken.split(' ')[1];
    if(!token)
        return false;
    return token;
}
function isValidNews(news) {
    return !!news && news.title && news.titleContent && news.content && news.tag;
}

module.exports = router;