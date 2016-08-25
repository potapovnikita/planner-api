'use strict';

const crypto = require('crypto-js');
const express = require('express');
const User = require('../models/user');
const router = express.Router();

/** Sign up action **/
router.post('/up', (req, res) => {
    if (!req.body.email || !req.body.password) {
        return res.sendStatus(400);
    }

    User.create({
        email: req.body.email,
        password: req.body.password
    }, (err, user) => {
        if (err && err.code == 11000) return res.sendStatus(409);
        if (err) return res.sendStatus(500);

        let session = {
            ip: req.ip,
            token: crypto.lib.WordArray.random(256 / 8).toString(),
            os:req.useragent.os,
            browser:req.useragent.browser,
            device:req.useragent.isMobile ? 'Mobile' : 'PC'
        };

        user.sessions.push(session);
        user.save((err) => {
            if (err) return res.sendStatus(500);
            res.send(session);
        });
    });
});

/** Sign in action **/
router.post('/in', (req, res) => {

    if (!req.body.email || !req.body.password) {
        return res.sendStatus(400);
    }

    User.findOne({
        email: req.body.email
    }).exec((err, user) => {
        if (err) return res.sendStatus(500);
        if (!user) return res.sendStatus(404);
        user.auth(req.body.password, req.ip, req.useragent, (err, session) => {
            if (err && err.status) return res.sendStatus(err.status);
            if (err) return res.sendStatus(500);

            res.send(session);
        });
    });
});

/* Sign out action */
router.post('/out', (req, res) => {
    if (!req.headers['authorization']) return res.sendStatus(400);

    User.findOneAndUpdate({
        'sessions.token': req.headers['authorization']
    }, {
        $pull: {
            'sessions': {
                'token': req.headers['authorization']
            }
        }
    }, function(err, user) {
        if (err) return res.sendStatus(500);
        res.sendStatus(200);
    });
});

module.exports = router;
