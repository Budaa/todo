var User = require('./../../models/user')
var router = require('express').Router()
var bcrypt = require('bcrypt')

//REGISTER

router.post('/register', function(req, res, next) {
	var user = new User({
		email: req.body.email
	})
//CHecking if user exist
	User.find({ email: user.email}, function(err, data) {
		if(data.length) {
			console.log(data)
			return next("User already exist")
		}
		bcrypt.hash(req.body.password, 10, function(err, hash) {
			if (err) {
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


router.get('/:username', function(req, res, next) {

})
module.exports = router