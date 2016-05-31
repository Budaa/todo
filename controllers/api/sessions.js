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

module.exports = router