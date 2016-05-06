var express = require('express')
var bodyParser = require('body-parser')
var logger = require('morgan')
var db = require('./db')

//MODEL
var ToDo = require('./models/todo')
var User = require('./models/user')


var app = express()
var port = process.env.PORT || 3000
app.use(express.static(__dirname));

app.use(bodyParser.json())
app.use(logger('dev'))

var value = ""

//ROUTERS
app.get('/', function(req, res) {
	res.sendfile('index.html')
})

app.get('/page', function(req, res, next) {
	res.sendfile('page.html', function(err) {
		if(err) {
			res.status(404).send({error: 'Coudn\'t find a file'})
		}
	})
})

app.get('/test', function(req, res) {
	res.status(404)
})

app.post('/test', function(req, res) {
	if( !req.body.message ){
		res.status(404)
	}
	res.send(req.body.message)
})

app.post('/todo', function(req, res, next) {
	var todo = new ToDo({
		username: req.body.username,
		body: req.body.body
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

app.get('/todo/:username', function(req, res, next) {
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

app.patch('/todo', function(req, res, next) {
	//Check done value
	ToDo.find({ _id: req.body.id }, 'done', function(err, data) {
		if (err) {
			res.status(404)
			return next(err)
		}
		//setting oppisite done value
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

app.delete('/todo/:id', function(req, res, next) {
	ToDo.remove({_id: req.params.id}, function(err, data) {
		if(err) {
			res.status(404)
		}
		res.status(200).json(data)
	})

})

app.listen(port, function() {
	console.log('App listen on port: ' + port)
})