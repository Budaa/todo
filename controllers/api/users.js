var User = require('./../../models/user')
var router = require('express').Router()


//REGISTER

router.get('/register/:email', function(req, res, next) {
	User.find({ email: req.params.email}, function(err, data) {
			if(!data.length) {
				return res.send(false)
			}
			return res.send(true)
		})
})

router.get('/:username', function(req, res, next) {

})
module.exports = router