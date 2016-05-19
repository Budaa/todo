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
	// 0 - Today
	// 1 - Tomorrow
	// 2 - This Week
	// 3 - Some day
	until: {
		type: Number,
		min: 0,
		max: 3,
		required: true
	},
	done: {
		type: Boolean,
		required: true,
		default: 0
	}
})

module.exports = ToDo