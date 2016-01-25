// Import globals require
// jslint node: true
'use strict';
var gulp = require('gulp');
var less = require('gulp-less');
var replace = require('gulp-html-replace');
var uglify = require('gulp-uglify');
var sync = require('browser-sync');
var webserver = require('gulp-webserver');
var del = require('del');
var rimraf = require('rimraf');
var browserify = require('gulp-browserify');

// Establish paths
var paths = {
	src: {
		base: 'src',
		test: 'src/test' // will need for future tests
	},
	dest: {
		base: 'build',
		test: 'build/test' // will need for future tests
	},
	page: {
		name: 'index.html'
	},
	all: {
		call: ['src/scripts/*.js', 'src/scripts/**/*.js', 'src/index.html'],

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

gulp.task('scripts', function() {
	gulp.src('src/scripts/main.js', {read: false})
		.pipe(browserify({
		entries : ['./main.js'],
		insertGlobals : true,
		debug : !gulp.env.production
		}))
	.pipe(gulp.dest('build/js'))
});

gulp.task('less', ['clean'], function () {
	return gulp.src('src/less/*.less')
		.pipe(less())
		.pipe(gulp.dest('build/css'));
});

gulp.task('uglify', function () {
	return gulp.src('build/js/*')
		.pipe(uglify())
		.pipe(gulp.dest('build/js'));
});

gulp.task('html', function () {
	return gulp.src('src/index.html')
		.pipe(replace({
			js: 'js/app.js'
		}))
		.pipe(gulp.dest('build'));
});

gulp.task('serve', ['default'], function(){
	gulp.src(paths.dest.base)
		.pipe(webserver(getServer()));
});

gulp.task('default', ['clean', 'scripts', 'uglify', 'less', 'html']);