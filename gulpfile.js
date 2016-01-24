// Import globals require
// jslint node: true
'use strict';
var gulp = require('gulp');
var less = require('gulp-less');
var replace = require('gulp-html-replace');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sync = require('browser-sync');
var webserver = require('gulp-webserver');
var del = require('del');
var rimraf = require('rimraf');

// Establish paths
var paths = {
	src: {
		base: 'src'
	},
	dest: {
		base: 'build'
	},
	page: {
		name: 'index.html'
	}
}

// Create Server
function getServer(){
	return {
		host: '127.0.0.1',
		path: '/',
		port: '8000'
	}
}

// Tasks

// del build directory
gulp.task('clean', function (cb) {
	rimraf(paths.dest.base, cb);
});

gulp.task('less', ['clean'], function () {
	return gulp.src('src/less/*.less')
		.pipe(less())
		.pipe(gulp.dest('build/css'));
});

gulp.task('html', function () {
	return gulp.src('src/index.html')
		.pipe(replace({
			js: 'js/app.js'
		}))
		.pipe(gulp.dest('build'));
});

gulp.task('uglify', ['concat'], function () {
	return gulp.src('build/js/*')
		.pipe(uglify())
		.pipe(gulp.dest('build/js'));
});

gulp.task('concat', function () {
	return gulp.src(['src/scripts/utils.js', 'src/scripts/main.js'])
		.pipe(concat('app.js'))
		.pipe(gulp.dest('build/js'));
});

gulp.task('serve', ['default'], function(){
	gulp.src(paths.dest.base)
		.pipe(webserver(getServer()));
});

gulp.task('default', ['clean', 'less', 'concat', 'uglify', 'html']);