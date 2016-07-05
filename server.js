var express = require('express')
var bodyParser = require('body-parser')
var logger = require('morgan')
var db = require('./db')
var config = require('./config')

//MODELS
var User = require('./models/user')


var app = express()
var port = process.env.PORT || 3000
app.use(express.static(__dirname));

app.set('secret', config.secret)

app.use(bodyParser.json())
app.use(logger('dev'))

app.use(require('./auth'))

//CONTROLLERS
//STATIC
app.use(require('./controllers/static'))

//API
//TODO
app.use('/api/todo', require('./controllers/api/todos'))
app.use('/api/user', require('./controllers/api/users'))
app.use('/api/user/stat', require('./controllers/api/stats'))
// app.use('/api/session', require('./controllers/api/sessions'))


//LISTENER
app.listen(port, function() {
	console.log('App listen on port: ' + port)
})