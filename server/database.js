const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const crypto = require('crypto');

const url = 'mongodb://localhost:27017/news-portal';

class DataBase {
    constructor() {
        MongoClient.connect(url, (err, db) => {
            if(err)
                throw new Error("Can't connect to the database");
            console.log("Connected successfully to db");
            module.exports = db;
            this.usersCollection = db.collection('Users');
            this.newsCollection = db.collection('News');
        });
    }

    logInAsync(user) {
        return this.usersCollection.findOne(user)
            .then((user) => {
                if (!user)
                    return Promise.reject("The user name and password don't match");
                return user;
            })
    }

    checkInAsync(user) {
        var self = this;
        return self.usersCollection.findOne(user)
            .then((data) => {
            if (data)
                return Promise.reject('This login is already registered');
            return;
        }).then(() => {
            return self.generateTokenAsync();
        }).then((token) => {
            user.token = token;
            return self.usersCollection.insertOne(user);
        }).then((data) => {
            if (data.insertedCount != 1)
                Promise.reject('Error');
            return (data.ops[0]);
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
    generateTokenAsync() {
        return new Promise(function (resolve, reject) {
            crypto.randomBytes(64, (err, buf) => {
                if (err)
                    reject(err);
                resolve(buf.toString('hex'));
            })
        })
    }
}


module.exports = new DataBase();