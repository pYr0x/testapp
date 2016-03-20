var path = require('path');
var gulp = require('gulp');
var symdest = require('gulp-symdest');
var clean = require('gulp-clean');
var electron = require('gulp-awesome-electron');


gulp.task('clean', function () {
	return gulp.src('app', {read: false})
		.pipe(clean());
});


gulp.task('build-electron-windows', ['clean'], function () {
	return gulp.src('src/**')
		.pipe(electron({
			version: '0.37.2',
			//platform: 'darwin',
			platform: 'win32',
			//platform: 'linux',
			arch: 'x64',
			darwinIcon: path.join('./resources/', 'icon.icns'),
			winIcon: path.join('./resources/', 'icon.ico')
		}))
		.pipe(symdest('app'));
});