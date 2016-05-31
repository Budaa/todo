var router = require('express').Router()
var User = require('../../models/user')
var bcrypt = require('bcrypt')
var jwt = require('jwt-simple')
var config = require('../../config')


/**
 * [settitng token an jwt for an valid user]
 * @param  {[type]} req           [body.email, body.password]
 * @param  {[type]} res           [token or error]
 */
router.post('/login', function(req, res, next) {
//checking if there is data provided
	if(req.body.email == '' || req.body.password == '') {
		res.status(400).send({error: 'Email or password wasn\'t provided'})
	}
//CHecking if user exist
	User.find({ email: req.body.email}, function(err, data) {
		if(data.length) {
			//checking if password is correct
			bcrypt.compare(req.body.password, data.password, function(err, data) {
				if(err) {
					throw next(err)
				}
				if(!data) {
					res.status(403).send({error: 'Wrong password.'})
				}else {
					//setting and sending jwt token
					var token = jwt.encode({email: req.body.email, password: bcrypt.hash(req.body.password, 10)}, config.secret)
					res.send(token)
				}
			})
		}
	})
})

module.exports = router