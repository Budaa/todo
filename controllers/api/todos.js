var ToDo = require('./../../models/todo')
var router = require('express').Router()
var value = ""


router.post('/', function(req, res, next) {
	var todo = new ToDo({
		username: req.body.username,
		body: req.body.body,
		until: req.body.until
	})

	todo.save(function(err, data) {
		if(err) { 
			res.status(500)
			return next(err) 
		}
		//TODO
		//Check if it's acctualy saved
		res.status(201).json(data)
	})
})

router.get('/:username', function(req, res, next) {
	ToDo.find({ username: req.params.username})
		.exec(function(err, data) {
			if(err) {
				res.status(500)
				return next(err)
			}
			res.status(200)
			res.json(data)
		})
})

router.patch('/', function(req, res, next) {
	//Check done value
	ToDo.find({ _id: req.body.id }, 'done', function(err, data) {
		if (err) {
			res.status(404)
			return next(err)
		}
		//setting opposite done value
		value = !data[0].done
		//change done value to oppiste
		ToDo.findOneAndUpdate({_id: req.body.id }, { done: value }, null, function(err, data) {
			if (err) {
				res.status(404)
				return next(err)
			}
			res.status(200).send(data)
		})
	})

})

router.delete('/:id', function(req, res, next) {
	ToDo.remove({_id: req.params.id}, function(err, data) {
		if(err) {
			res.status(404)
		}
		res.status(200).json(data)
	})

})

module.exports = router