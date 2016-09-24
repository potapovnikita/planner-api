'use strict';

const async = require('async');
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const fs = require('fs');
const path = require('path');

// Get users
router.get('/', (req, res, next) => {
	res.json(req.user);
});

// Patch user
router.patch('/data', (req, res, next) => {
	User.findOneAndUpdate({ _id: req.user._id }, req.body).exec((err, user) => {
		if (err) return res.sendStatus(500);
		res.json(user);
	});
});

// Add todo
router.put('/todo', (req, res) => {
	if(!req.body) {
		return res.sendStatus(400);
	}

	User.findOne({_id: req.user._id})
	.exec ((err, user) => {
		user.todo.push(req.body);
		user.save((err) => {
			res.json(user.todo.pop());
		});
	});
});

//Patch todo
router.patch('/todo', (req, res) => {
	if(!req.body) {
		return res.sendStatus(400);
	}

	User.findOneAndUpdate({_id: req.user._id}, req.body)
	.exec ((err, user) => {
		if(err) return res.sendStatus(400);
		res.json(user);
	});
});

// Patch time
router.patch('/todo/time', function(req, res) { 
	if (!req.body) {
		return res.sendStatus(400);
	}
	User.findOne({ _id: req.user })
	.exec((err, user) => {
		if (err) return res.sendStatus(400);

		var todo = user.todo.filter(function(todo) {
			return todo._id == req.body._id;
		}).pop();

		user.todo.id(todo._id).time = req.body.time;
		user.save((err) => {
			if (err) return res.sendstatus(500);
			res.json(user);
		});
	});
});

//delete todo

router.delete('/todo/:todoId', (req, res) => {
	if(!req.body) {
		return res.sendStatus(400);
	}

	User.findOne({_id: req.user._id}, req.body)
	.exec ((err, user) => {
		if(err) return res.sendStatus(400);
		
		var todo = user.todo.filter(function(todo) {
			return todo._id == req.params.todoId;
		}).pop();
		if (!!todo) user.todo.id(todo._id).remove();
		user.save((err) => {
			if (err) return res.sendstatus(500);
			res.json(user);
		});
	});
})

//patch avatar
router.patch('/avatar', function(req, res) {

	fs.writeFile(path.join(__dirname, '../avatar/'), function(err) {
		if (err) return res.sendStatus(500);

		User.findOneAndUpdate({
			_id: req.user._id,
		}, {
			avatar: '/user/avatar/'
		})
		.exec(function(err) {
			if (err) return res.sendStatus(500);
			res.json('/user/avatar/');
		});
	});
})


router.delete('/sessions/:sessionId', function(req, res) { 
    User.findOne({ _id: req.user })
    .exec((err, user) => {
        if (err) return res.sendStatus(400);

        var session = user.sessions.filter(function(session) {
            return session._id == req.params.sessionId;
        }).pop();

        if (!!session) user.sessions.id(session._id).remove();

        user.save((err) => {
            if (err) return res.sendstatus(500);

            res.json(user);
        })
    });
});


module.exports = router;
