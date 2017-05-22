const MongoClient = require('mongodb').MongoClient;
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
    logIn (user) {
        return new Promise((resolve, reject) => {
            this.usersCollection.findOne(user, (err, data) => {
                if (err || !data) {
                    reject(err);
                    return;
                }
                resolve(data.name);
            })
        });
    }
    checkIn (user) {
        return new Promise((resolve, reject) => {
            this.usersCollection.findOne(user, (err, data) => {
                if(err || data) {
                    reject(err);
                    return;
                }
                this.usersCollection.insertOne(user, (err, data) => {
                    if(err && data.insertedCount != 1) {
                        reject(err);
                    }
                    resolve(data);
                });
            })
        });
    }
}

module.exports = new DataBase();