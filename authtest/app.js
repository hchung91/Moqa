var bodyParser = require('body-parser');
var express = require('express');
var bcrypt = require('bcryptjs')
var slug = require('mongoose-slug');
//var csrf = require('csurf');
var mongoose = require('mongoose');
var sessions = require('client-sessions');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

//connect to mongo
var User = mongoose.model('moqaUser', new Schema({
	moqaName: {type: String, unique: true},
	firstName: String,
	lastName: String,
	email: {type: String, unique: true},
	password: String,
}));

var threadSchema = new Schema({
	_id: ObjectId,
	moqaName: String,
	threadTitle: String,
	threadContent: String,
	threadDate: String,
	threadTimeStamp: String,
});
var Thread = mongoose.model('moqaThread', threadSchema);

var commentSchema = new Schema({
	_id: ObjectId,
	threadId: String,
	commentId: String,
	parentComment: String,
	moqaName: String,
	commentDate: String,
	commentTimeStamp: String,
	commentContent: String,
	fullSlug: String,
	score: Number,
});
var Comment = mongoose.model('moqaComment', commentSchema);


commentSchema.plugin(slug(['threadId', 'parentComment', 'commentId', 'moqaName', 'commentTimeStamp']));
threadSchema.plugin(slug(['threadId', 'moqaName', 'threadTimeStamp']));

var app = express();
app.use(express.static(__dirname+'/'));
app.set('view engine', 'jade');
app.locals.pretty = true;

var db = mongoose.connection;
mongoose.connect('mongodb://localhost/mongoMoqaDB');

// MIDDLEWARE
app.use(bodyParser.urlencoded({extended: true}));

app.use(sessions({
	cookieName: 'session',
	secret:'jaslsad9fa87dfj234asdfasd9f8ah98ysdf',
	duration: 30*60*1000,
	activeDuration: 5*60*1000,
	httpOnly: true, //don't let browser js ever access cookies
	secure: true, // only use cookies over https
	ephemeral: true, //delete this cookie when the broswer is closed
	// also look at passportjs and drywall
}));

//app.use(express.csrf());

app.use(function(req, res, next){
	if (req.session && req.session.user){
		User.findOne({email: req.session.user.email}, function(err, user){
			if(user){
				req.user = user;
				delete req.user.password;
				req.session.user = req.user;
				res.locals.user = req.user;
			}
			next();
		});
	}
	else{
		next();
	}
});

function requireLogin(req, res, next){
	if(!req.user){
		res.redirect('/login');
	}
	else{
		next();
	}
};

//if logged in: redirect to dashboard
function dashboardRedirect(req, res, next){
	if(req.user){
		res.redirect('/dashboard');
	}
	else{
		next();
	}
}

// VIEWS
app.get('/', function(req, res){
	//res.render('index.jade', {csrfToken: req.csrfToken()});
	res.render('index.jade');
});

app.get('/register', function(req,res){
	res.render('register.jade');
})

app.post('/login', function(req,res){
	User.findOne({email:req.body.email}, function(err, user){
		if (!user){
			res.render('login.jade', {error: 'Invalid email or password!'})
		}
		else{
			if (bcrypt.compareSync(req.body.password, user.password)){
				req.session.user = user;
				res.redirect('/dashboard')
			}
			else{
				res.render('login.jade', {error: 'Invalid email or password!'})
			}
		}
	});
});

app.get('/login', dashboardRedirect, function(req,res){
	//res.render('login.jade', {csrfToken: req.csrfToken()});
	res.render('login.jade');
})

app.post('/register', function(req,res){
	var hash = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));

	var user = new User({
		moqaName: req.body.moqaName,
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		email: req.body.email,
		password: hash,
	});
	console.log(user)
	user.save(function(err){
		if (err){
			console.log(err.code)
			var error = 'Something bad happened! Try again!';
			if (err.code === 11000){
				error = 'ERROR: That email or username is already taken.';
			}
			res.render('register.jade', {'error': error});
		}
		else{
			res.redirect('/dashboard');
		}
	})
});

app.get('/dashboard', requireLogin, function(req,res){
	//console.log(req.session.threadId)
	var moqaComment = mongoose.model('moqaComment');
	moqaComment.find({'moqaName': req.session.user.moqaName}, {}, function(e, comments){
		if (comments.length > 0){
			console.log(comments[0].commentContent);
		}
		res.render('dashboard.jade', {'comments': comments});
	});
});

app.post('/dashboard', function(req,res){
	var id = new mongoose.Types.ObjectId;

	var comment = new Comment({
		_id: id,
		commentId: id,
		threadId: 1,
		moqaName: req.session.user.moqaName,
		commentTimeStamp: new Date().getTime(),
		commentDate: new Date(),
		commentContent: req.body.commentContent,
	})
	comment.save(function(err){
		comment.slug;
		if(err){
			var err = 'Something bad happened! Try again!';
		}
		else{
			res.redirect('/dashboard');
		}
	})
})

app.get('/test', function(req,res){
	var moqaThread = mongoose.model('moqaThread');
	moqaThread.find({}, {}, function(e, threads){
		if (threads.length > 0){
			console.log(threads[0].threadContent);
		}
		res.render('test.jade', {'threads': threads});
	});
})

app.post('/test', function(req,res){
	var id = new mongoose.Types.ObjectId;
	req.session.threadId = id;

	var thread = new Thread({
		_id: id,
		threadId: id,
		moqaName: req.session.user.moqaName,
		threadTimeStamp: new Date().getTime(),
		threadDate: new Date(),
		threadTitle: req.body.threadTitle,
		threadContent: req.body.threadContent,
	})

	thread.save(function(err){
		thread.slug;
		if(err){
			var err = 'Something bad happened! Try again!';
		}
		else{
			res.redirect('/test/'+id);
		}
	})
});

//Known Working get Function for /test/:threadId
//Known Working get Function for /test/:threadId

app.get('/test/:threadId', function(req,res){
	var moqaComment = mongoose.model('moqaComment');
	var activeThread = mongoose.model('moqaThread');
	
	activeThread.find({'_id': req.param('threadId')}, {}, function(e, thread){
		moqaComment.find({'threadId': req.param('threadId')}).sort({fullSlug:1,commentTimeStamp:1}).exec(function(e, comments){
			res.render('thread.jade', {'thread': thread, 'comments': comments});
		});	
	});
});




app.post('/test/:threadId', function(req,res){
	var threadId = req.params.threadId;
	var moqaComment = mongoose.model('moqaComment');
	var id = new mongoose.Types.ObjectId;
	
	moqaComment.findOne({'commentId': req.body.commentParentId}, {}, function(e, comments){
		var fullSlug = id;
		if(comments != null){
			fullSlug = comments.fullSlug +'/'+ fullSlug;
		}

		var comment = new Comment({
			_id: id,
			parentComment: req.body.commentParentId,
			commentId: id.toString(),
			threadId: threadId,
			moqaName: req.session.user.moqaName,
			commentDate: new Date(),
			commentTimeStamp: new Date().getTime(),
			commentContent: req.body.commentContent,
			fullSlug : fullSlug,
			score: 1,		
		})
		comment.save(function(err){
			comment.slug;
			if(err){
				var err = 'Something bad happened! Try again!';
			}
			else{
				res.redirect('/test/'+threadId);
			}
		})
	});
})

//Need to add validation and redirect to threadpage
app.put('/test', function(req,res){
	var id = req.param('comment');
	console.log(id)
	var vote = req.param('vote');
	var moqaComment = mongoose.model('moqaComment');
	if (vote === 'upvote'){
		moqaComment.update({'commentId': id}, {$inc:{quantity:1, "score":1}}, function(err){
			console.log('updated');
		});
	}
	else{
		moqaComment.update({'commentId': id}, {$inc:{quantity:1, "score":-1}}, function(err){
			console.log('updated');
		});
	}
})

app.get('/logout', function(req,res){
	req.session.reset();

	res.render('index.jade');
})

app.listen(3000);