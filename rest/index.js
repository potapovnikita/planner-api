'use strict';

const User = require('../models/user')

module.exports = function(app) {

    /** Unsecured REST **/
    app.use('/sign', require('./sign'));

    /** Secured REST **/
    app.use('*', (req, res, next) => {
        if (req.method === 'OPTIONS') next();

        let session = req.headers['authorization'];
        if (!session) return res.sendStatus(403);

        User.findOne({
                'sessions.token': session
            })
            .select('-hash -sessions')
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
