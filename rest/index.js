'use strict';

const User = require('../models/user')
const fs = require('fs');
const path = require('path');

module.exports = function(app) {

    /** Unsecured REST **/
    app.use('/sign', require('./sign'));

    /** Get avatar **/
    app.get('/user/avatar/:avatar', function(req, res, next) {
        fs.access(path.join(__dirname, '../avatar/' + req.params.avatar), fs.R_OK, function(err) {
            if (err) return res.sendStatus(404);
            res.sendFile(path.join(__dirname, '../avatar/' + req.params.avatar));
        })
    });

    /** Secured REST **/
    app.use('*', (req, res, next) => {
        if (req.method === 'OPTIONS') next();

        let session = req.headers['authorization'];
        if (!session) return res.sendStatus(403);

        User.findOne({
            'sessions.token': session
        })
        .select('-hash')
        .exec((err, user) => {
            if (err) return res.sendStatus(500);
            if (!user) return res.sendStatus(403);
            req.user = user;
            next();
        });
    });

    /** Models REST **/
    app.use('/user', require('./user'));

    /** Undefined REST **/
    app.use('*', function(req, res, next) {
        res.sendStatus(404);
    });
}
