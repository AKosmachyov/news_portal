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

    getNewsByRange(from, to) {
        let count = to - from + 1;
        let skip = from == 0 ? 0 : --from;
        return new Promise((resolve, reject) => {
            this.newsCollection.find().skip(skip).limit(count).toArray((err, arr) => {
                if (err) {
                reject(err);
                    return;
                }
                resolve(arr);
            })
        })
    }

    getNewsById(id) {
        return new Promise((resolve, reject) => {
            //TODO check other options ObjectID
            this.newsCollection.findOne({_id: new ObjectID(id)}, (err, news) => {
                if (err || !news) {
                    reject(err);
                    return;
                }
                resolve(news);
            })
        });
    }

    insertNews(news) {
        return new Promise((resolve, reject) => {
            this.newsCollection.insertOne(news, (err, data) => {
                if (err && data.insertedCount != 1) {
                    reject(err);
                    return;
                }
                resolve(data);
            })
        })
    }
}

module.exports = new DataBase();