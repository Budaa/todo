var db = require('../db')
var postSchema = new db.Schema({
	id: {
		type: db.Schema.ObjectId,
		required: true
	}
 });


var User = db.model('User', {
	username: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	date: {
		type: Date,
		required: true,
		default: Date.now
	},
	posts: [postSchema]
})

module.exports = User