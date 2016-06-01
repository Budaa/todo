var User = require('../../models/user')
var router = require('express').Router()
var bcrypt = require('bcrypt')
var jwt = require('jwt-simple')
var config = require('../../config')


//LOGIN
router.post('/login', function(req, res, next) {
//checking if there is data provided
	if(req.body.email == '' || req.body.password == '') {
		res.status(400).send({error: 'Email or password wasn\'t provided'})
	}
	var hash = bcrypt.hashSync(req.body.password, 10)
//CHecking if user exist
	User.findOne({ email: req.body.email})
		.select('password')
		.exec(function(err, data) {
			if(err) {
				throw next(err)
			}
			if(data) {
				//checking if password is correct
				bcrypt.compare(req.body.password, data.password, function(err, result) {
					if(err) { throw next(err) }
					if(result) {
						var token = jwt.encode({email: req.body.email}, config.secret)
						res.send(token)						
					}else {
						res.status(403).send({error: 'Wrong password.'})
					}
				})
			}
		})
})

//REGISTER
router.post('/register', function(req, res, next) {
	var user = new User({
		email: req.body.email
	})
//CHecking if user exist
	User.find({ email: user.email}, function(err, data) {
		if(data.length) {
			console.log(data)
			res.status(403)
			return next("User already exist")
		}
		bcrypt.hash(req.body.password, 10, function(err, hash) {
			if (err) {
				res.status(403)
				return next(err)
			}
			user.password = hash
			user.save(function(err, user) {
				if(err) { throw next(err) }
				res.status(201)
				res.json(user)
			})

		})
	})
})

router.get('/', function(req, res, next) {
	if(req.headers['x-auth']) {
		var auth = jwt.decode(req.headers['x-auth'], config.secret)
		res.status(200).send(auth)
	}else {
		res.status(404).send({error: "You aren't logged in"})
	}

})
router.get('/:username', function(req, res, next) {

})
module.exports = router