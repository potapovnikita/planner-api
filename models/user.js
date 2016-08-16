var crypto = require('crypto-js');
var moment = require('moment');
var async = require('async');

var mongoose = require('../middleware/mongoose');
var config = require('../config');

var schema = new mongoose.Schema({
    created: Date,
    updated: Date,
    email: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    hash: {
        type: String,
        required: true
    },
    sessions: [new mongoose.Schema({
        ip: String,
        token: String
    })]
});

schema.virtual('password').set(function(value) {
    this.hash = crypto.SHA512(value).toString();
});

schema.pre('save', function(next) {
    if (this.isNew) {
        this.created = moment().format();
    }
    this.updated = moment().format();
    next();
});

schema.methods.auth = function(password, ip, callback) {
    var self = this;

    async.waterfall([
        function(callback) {

            var session = self.sessions.filter(function(session) {
                return session.ip === ip;
            }).pop();

            if (!!session) self.sessions.id(session._id).remove();
            callback(null);
        },
        function(callback) {
            if (crypto.SHA512(password).toString() === self.hash) {

                var session = {
                    ip: ip,
                    token: crypto.lib.WordArray.random(256 / 8).toString()
                };

                self.sessions.unshift(session);
                
                self.save(function(err) {
                    if (err) return callback(err);
                    callback(null, session);
                });
            } else {
                var err = new Error('Forbidden');
                err.status = 403;
                callback(err);
            }
        }
    ], callback);
};

module.exports = mongoose.model('user', schema);
