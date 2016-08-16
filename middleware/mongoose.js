var mongoose = require('mongoose');
var config = require('../config');

mongoose.connect(config.get('mongoose:server') + config.get('mongoose:db'));

module.exports = mongoose;
