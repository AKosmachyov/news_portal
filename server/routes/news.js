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
    dataBase.getNewsByRange(from, to).then((data)=>{
        res.json(data);
    }).catch(()=>{
        res.send('Err');
    });

});
router.get('/:id', function(req, res, next) {
    dataBase.getNewsById(req.params.id).then(
        (news) => res.json(news),
        (err) => res.json(err)
    );
});
router.post('/insert', function(req, res, next) {
    if (!isValidNews(req.body)) {
        res.send('Incorrect data', 400);
        return;
    }
    req.body.publicationDate = new Date();
    //TODO check author
    dataBase.insertNews(req.body)
        .then(
            ()=> res.send('Success'),
            ()=> res.send('News not added', 500)
        );
});
router.post('/:id/modify', function(req, res, next) {
    res.send('not ready');
});
function isValidNews(news) {
    return !!news && news.title && news.titleContent && news.content && news.tag;
}

module.exports = router;