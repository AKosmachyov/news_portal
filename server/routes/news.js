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
    if (!isValidNews(req.body)) {
        res.send('Incorrect data', 400);
        return;
    }
    req.body.publicationDate = new Date();
    //TODO check author
    dataBase.insertNewsAsync(req.body)
        .then(()=>
            res.send('Success')
        ).catch(()=>
            res.send('News not added', 400))
});
router.post('/:id/modify', function(req, res, next) {
    //TODO check author
    let id = req.params.id;
    if (!isValidNews(req.body) && !id) {
        res.send('Incorrect data', 400);
        return;
    }
    req.body.modifiedDate = new Date();
    dataBase.modifyNewsAsync(req.body)
        .then(() =>
            res.send('Success')
        ).catch((err) =>
            res.send(err, 400)
        )
});
function isValidNews(news) {
    return !!news && news.title && news.titleContent && news.content && news.tag;
}

module.exports = router;