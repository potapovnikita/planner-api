'use strict';

const async = require('async');
const express = require('express');
const router = express.Router();
const User = require('../models/user');


// Get users
router.get('/', (req, res, next) => {
    res.json(req.user);
});

// Patch user
router.patch('/', (req, res, next) => {
    User.findOneAndUpdate({ _id: req.user._id }, req.body).exec((err, user) => {
        if (err) return res.sendStatus(500);
        res.send(user);
    });
});

// Add todo
router.put('/todo', (req, res) => {
    //
});

module.exports = router;
