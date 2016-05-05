var mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/todo', function() {
	console.log('mongodb connected')
})

module.exports = mongoose
