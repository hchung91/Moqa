var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

/* GET users listing. */
router.get('/', function(req, res, next) {
  mongoose.model('MoqaComment').find(function(err,comment){
		res.send(comment);
	})
});

module.exports = router;
