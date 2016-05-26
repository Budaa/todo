var express = require('express')
var router = express.Router()

router.use(express.static(__dirname + '/../assets'))
router.use(express.static(__dirname + '/../templates'))

router.get('/', function(req, res) {
	res.sendfile('layouts/app.html')
})
router.get('/fb', function(req, res) {
	res.sendfile('fb.html')
})

router.get('/page', function(req, res, next) {
	res.sendfile('page.html', function(err) {
		if(err) {
			res.status(404).send({error: 'Coudn\'t find a file'})
		}
	})
})


module.exports = router