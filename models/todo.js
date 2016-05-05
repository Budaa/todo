var db = require('../db')

var ToDo = db.model('ToDo', {
	username: {
		type: String,
		required: true
	},
	body: {
		type: String,
		required: true
	},
	date: {
		type: Date,
		required: true,
		default: Date.now
	},
	deadline: {
		type: Date,
		required: false
	},
	done: {
		type: Boolean,
		required: true,
		default: 0
	}
})

module.exports = ToDo