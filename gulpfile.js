var path = require('path');
var gulp = require('gulp');
var symdest = require('gulp-symdest');
var del = require('del');
var electron = require('gulp-awesome-electron');
var runSequence = require('run-sequence');
var stealStream = require("steal-tools").streams;

var config = {
	companyName: 'Julian Kern',
	linuxExecutableName: 'jk',

	buildFolder: __dirname+'/dist/bundles',
	desktopFolder: path.join('dist', 'desktop', '**', '*'),
	appFolder: 'app',
	resourcesFolder: 'resources'
};


function buildAppFor(targetPlatform, target) {
	return gulp.src(config.desktopFolder)
		.pipe(electron({
			version: '0.37.2',
			platform: targetPlatform,
			arch: 'x64',
			companyName: config.companyName,
			linuxExecutableName: config.linuxExecutableName,
			darwinIcon: path.join(config.resourcesFolder, 'icon.icns'),
			winIcon: path.join(config.resourcesFolder, 'icon.ico')
		}))
		.pipe(symdest(path.join(config.appFolder, 'build', target)));
}

gulp.task('[private]:clean', function () {
	return del([
		'app/**/*',
		'dist/bundles/**/*',
		'dist/desktop/**/*'
	], {force: true});
});

gulp.task('[private]:copy-source', function () {
	return gulp.src(path.join('src', '**', '*.*'))
		.pipe(gulp.dest(path.join('dist', 'desktop', 'src')));
});

gulp.task('[private]:copy-bundles', function () {
	return gulp.src(path.join('dist', 'bundles', '**', '*.*'))
		.pipe(gulp.dest(path.join('dist', 'desktop', 'bundles')));
});

gulp.task('[private]:copy-resources', function () {
	return gulp.src(path.join('resources', '**', '*.*'))
		.pipe(gulp.dest(path.join('dist', 'desktop')));
});

gulp.task('[private]:copy-electron-source', function () {
	return gulp.src(path.join('electron', '**', '*.*'))
		.pipe(gulp.dest(path.join('dist', 'desktop')));
});

gulp.task('[private]:build-electron-windows', function () {
	return buildAppFor('win32', 'windows');
});


gulp.task('build-web', ['[private]:clean'], function(done){
	var system = {
		config: __dirname + "/package.json!npm"
	};

	var options = {
		minify: false,
		bundleSteal: true
	};

	var stream = stealStream.graph(system, options)
		.pipe(stealStream.transpile())
		.pipe(stealStream.minify())
		.pipe(stealStream.bundle())
		.pipe(stealStream.concat())
		.pipe(stealStream.write());

	stream.on("data", function(){
		done();
	});
});

gulp.task('build-electron-windows', function (done) {
	runSequence(
		'[private]:clean',
		'build-web',
		['[private]:copy-source', '[private]:copy-bundles', '[private]:copy-resources', '[private]:copy-electron-source'],
		'[private]:build-electron-windows',
		done
	)
});