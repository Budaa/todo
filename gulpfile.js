var gulp = require('gulp')
var concat = require('gulp-concat')
var nodemon = require('gulp-nodemon')

gulp.task('js', function(){
	gulp.src(['ng/module.js', 'ng/**/*.js'])
	  .pipe(concat('app.js'))
	  .pipe(gulp.dest('assets'))
})

gulp.task('watch:js', ['js'], function() {
	gulp.watch('ng/**/*.js', ['js'])
})

gulp.task('dev:server', function() {
	nodemon({
		script: 'server.js',
		ext: 'js',
		ignore: ['ng*', 'gulp*', 'assets*']
	})
})
gulp.task('dev', ['watch:js', 'dev:server'])