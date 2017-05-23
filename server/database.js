const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const assert = require('assert');

const url = 'mongodb://localhost:27017/news-portal';

class DataBase {
    constructor() {
        MongoClient.connect(url, (err, db) => {
            assert.equal(null, err);
            console.log("Connected successfully to db");
            module.exports = db;
            this.usersCollection = db.collection('Users');
            this.newsCollection = db.collection('News');
        });
    }

    logIn(user) {
        return new Promise((resolve, reject) => {
            this.usersCollection.findOne(user, (err, data) => {
                if (err || !data) {
                    reject(err);
                    return;
                }
                resolve(data);
            })
        });
    }

    checkIn(user) {
        return new Promise((resolve, reject) => {
            this.usersCollection.findOne(user, (err, data) => {
                if (err || data) {
                    reject(err);
                    return;
                }
                this.usersCollection.insertOne(user, (err, data) => {
                    if (err && data.insertedCount != 1) {
                        reject(err);
                    }
                    resolve(data);
                });
            })
        });
    }

    getNewsByRangeAsync(from, to) {
        let count = to - from + 1;
        let skip = from == 0 ? 0 : --from;
        return this.newsCollection.find().skip(skip).limit(count).toArray();
    }

    getNewsByIdAsync(id) {
        //TODO check other options
        if (!ObjectID.isValid(id))
            return Promise.reject('Bad id');
        return this.newsCollection.findOne({_id: new ObjectID(id)})
            .then((news) => {
                if (!news)
                    return Promise.reject('News not found');
                return news;
            })
    }

    insertNewsAsync(news) {
        return this.newsCollection.insertOne(news)
            .then((data) => {
                if (data.insertedCount != 1)
                    return Promise.reject('News not added');
                return data;
            })
    }

    modifyNewsAsync(news) {
        let id = news._id;
        delete news._id;
        delete news.publicationDate;
        if(!ObjectID.isValid(id))
            return Promise.reject('Bad id');
        //TODO using ObkectID
        return this.newsCollection.findAndModify({_id: new ObjectID(id)}, [], {$set: news})
            .then((data) => {
                if (!data.lastErrorObject.updatedExisting)
                    return Promise.reject('News not found');
                return;
            })
    }
}


module.exports = new DataBase();