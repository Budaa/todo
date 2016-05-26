var db = require('../db')
// var postSchema = new db.Schema({
// 	id: {
// 		type: db.Schema.ObjectId,
// 		required: true
// 	}
//  });

var User = db.model('User', {
	email: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true,
		select: false
	}
	dateCreated: {
		type: Date,
		required: true,
		default: Date.now
	}
	admin: {
		type: Boolean,
		required: true,
		default: false
	}
	// posts: [postSchema]
})

module.exports = User