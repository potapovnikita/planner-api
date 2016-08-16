var bodyParser = require('body-parser');
var express = require('express');
var logger = require('morgan');
var path = require('path');
var cors = require('cors');

var app = express();

app.use(cors({
    allowedHeaders: ['authorization', 'Content-Type'],
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
}));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


require('./rest')(app);

module.exports = app;