var router = require('express').Router()
var ToDo = require('./../../models/todo')
var User = require('../../models/user')

var Stats = {}
Stats.todosCount = function(email, done){
	ToDo.count({username: email}, function(err, c) {
		console.log('count is' + c)
		return done(c)
	})
}
//Possible security issiues - fix later
router.get('/:userEmail', function(req, res, next) {
	//return all stats
	var username = req.params.userEmail
	Stats.todosCount(username, function(result) {
		res.json(result)
	})
})



module.exports = router