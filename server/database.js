const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const crypto = require('crypto');
const HttpError = require('./error/HttpError');

const url = 'mongodb://localhost:27017/news-portal';
const options = {
    server : {
        reconnectTries: 5
    }
};

class DataBase {
    constructor() {
        MongoClient.connect(url, options, (err, db) => {
            if(err)
                throw new Error("Can't connect to the database");
            console.log("Connected successfully to db");
            module.exports = db;
            this.usersCollection = db.collection('Users');
            this.newsCollection = db.collection('News');
            this.tokensCollection = db.collection('Tokens');
        });
    }

    checkInAsync(user) {
        return this.usersCollection.insertOne(user);
    }

    getUserByQueryAsync(query){
        return this.usersCollection.findOne(query, {name: 1})
    }

    getNewsByRangeAsync(count, lastId) {
        return new Promise((resolve, reject) => {
            let searchObj = lastId ? {'_id': {'$lt': lastId }} : {};
            this.newsCollection.find(searchObj).sort({'_id': -1}).limit(count).toArray((err , arr) => {
                if(err)
                    reject(err);
                resolve(arr);
            });
        });
    }

    getNewsByQueryAsync(query) {
        return this.newsCollection.findOne(query)
            .then((news) => {
                if (!news)
                    return Promise.reject(new HttpError(400, 'News not found'));
                return news;
            })
    }

    insertNewsAsync(news) {
        return this.newsCollection.insertOne(news)
            .then((data) => {
                if (data.insertedCount != 1)
                    return Promise.reject(new HttpError(500, 'News not added'));
                return data;
            })
    }

    modifyNewsAsync(id ,news) {
        return this.newsCollection.findAndModify({_id: id}, [], {$set: news})
            .then((data) => {
                if (!data.lastErrorObject.updatedExisting)
                    return Promise.reject(new HttpError(400, 'News not found'));
                return;
            })
    }

    generateObjectIdAsync(str) {
        return new Promise((resolve, reject) => {
            if (!ObjectID.isValid(str))
                return reject(new HttpError(400,'Bad string'));
            resolve(new ObjectID(str));
        })
    }

    getUserIdByTokenAsync(token){
        return this.tokensCollection.findOne({token: token})
    }

    generateTokenAsync() {
        return new Promise(function (resolve, reject) {
            crypto.randomBytes(64, (err, buf) => {
                if (err)
                    reject(err);
                resolve(buf.toString('hex'));
            })
        })
    }

    insertTokenAsync(userId, token) {
        let expiryDate = new Date();
        expiryDate = new Date(expiryDate.getDate + 10);
        return this.tokensCollection.insertOne({
            userId: userId,
            token: token,
            expiryDate: expiryDate
        })
    }
}

module.exports = new DataBase();