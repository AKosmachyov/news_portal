const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const crypto = require('crypto');
const HttpError = require('./../error/HttpError');

const url = require('../serverConfig.json').MongoDbUrl || '';

var restartingFlag = false;

class DataBase {
    constructor() {
        MongoClient.connect(url, {reconnectTries: 5}, (err, db) => {
            if (err)
                throw new Error('Can not connect to the database');
            console.log('Connected successfully to db');
            this.usersCollection = db.collection('Users');
            this.newsCollection = db.collection('News');
            this.tokensCollection = db.collection('Tokens');
        });
    }

    checkInAsync(user) {
        return this.usersCollection.insertOne(user);
    }

    getUserByQueryAsync(query, options){
        if(!options)
            options = {name: 1};
        return this.usersCollection.findOne(query, options);
    }

    getNewsByRangeAsync(count, lastId) {
        return new Promise((resolve, reject) => {
            let searchObj = lastId ? {'_id': {'$lt': lastId }} : {};
            this.newsCollection.find(searchObj, {content: 0}).sort({'_id': -1}).limit(count).toArray((err , arr) => {
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

    checkPermissionAsync(newsId, userId) {
        const _self = this;
        var user;
        return _self.getUserByQueryAsync({_id: userId}, {userType: 1})
            .then((userBD) => {
                if(!userBD)
                    return Promise.reject(new HttpError(400,'Unknown user'));
                user = userBD;
                return;
            }).then(() => {
                return _self.getNewsByQueryAsync({_id: newsId})
            }).then((news) => {
                return user.userType == "admin" || news.author._id.toString() == user._id.toString();
        })
    }

    deleteNewsAsync(id) {
        return new Promise((resolve, reject) => {
            this.newsCollection.findOneAndDelete({_id: id}, (err, val) => {
                if(err)
                    return Promise.reject(err);
                if(val.lastErrorObject.n != 1)
                    return Promise.reject(new HttpError(500, 'Server error'));
                resolve();
            })
        })
    }

    connectToDb(self) {
        MongoClient.connect(url, {reconnectTries: 5}, (err, db) => {
            if (err) {
                console.log("Can not connect to the database");
                restartingFlag = false;
                return self.reconnectToDB();
            }
            console.log("Connected successfully to db");
            self.setCollectionToClass({
                usersCollection: db.collection('Users'),
                newsCollection: db.collection('News'),
                tokensCollection: db.collection('Tokens')
            });
            restartingFlag = false;
        });

    }

    reconnectToDB() {
        if(restartingFlag)
            return;
        restartingFlag = true;
        const _self = this;
        setTimeout(_self.connectToDb, 5000, _self);
    }

    setCollectionToClass(obj) {
        this.usersCollection = obj.usersCollection;
        this.newsCollection = obj.newsCollection;
        this.tokensCollection = obj.tokensCollection;
    }
}

module.exports = new DataBase();