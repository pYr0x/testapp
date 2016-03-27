var jshint = require('gulp-jshint');
var csslint = require('gulp-csslint');

var path = require('path');
var gulp = require('gulp');
var symdest = require('gulp-symdest');
var del = require('del');
var electron = require('gulp-awesome-electron');
var sh = require('shelljs');
var runSequence = require('run-sequence');
var stealStream = require("steal-tools").streams;

var config = {
	companyName: 'Julian Kern',
	linuxExecutableName: 'jk',

	buildFolder: __dirname+'/dist/bundles',
	desktopFolder: path.join('dist', 'desktop', '**', '*'),
	cordovaFolder: path.join('dist', 'mobile'),
	appFolder: 'app',
	resourcesFolder: 'resources'
};



gulp.task('[private]:clean', function () {
	return del([
		'app/**',
		'dist/bundles/**',
		'dist/desktop/**',
		'dist/mobile/**'
	], {force: true});
});

gulp.task('build-web', ['[private]:clean'], function(done){
	var system = {
		config: __dirname + "/package.json!npm"
		//jsonOptions: {
		//	transform: function(load, data) {
		//		console.log("hier", data);
		//		// Delete secret data
		//		delete data.configDependencies;
		//		return data;
		//	}
		//}
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


// -- CORDOVA
// --------------
function buildMobileAppFor(targetPlatform) {
	if(targetPlatform !== 'io' && targetPlatform !== 'android' && targetPlatform !== 'windows') {
		targetPlatform = '';
	}

	var currentDir = sh.pwd();
	sh.cd(path.join('dist', 'mobile'));
	sh.exec('ionic resources '+targetPlatform);
	sh.exec('cordova prepare '+targetPlatform);
	sh.exec('cordova build '+targetPlatform);
	sh.cd(currentDir);

	return gulp.src([
		path.join('dist', 'mobile', 'platforms', 'android', 'build', 'outputs', 'apk', '*')
	], {base: 'dist/mobile/platforms'})
		.pipe(symdest(path.join(config.appFolder, 'mobile')));
}

gulp.task('[private-cordova]:copy-source', function () {
	// src for progressive loading
	// bundled files (js and css)
	// global styles
	return gulp.src([
		path.join('src', '**', '*.*'),
		path.join('dist', 'bundles', '**', '*.*'),
		path.join('css', '**', '*.*')
	], {base: './'})
		.pipe(gulp.dest(path.join('dist', 'mobile', 'www')));
});

gulp.task('[private-cordova]:copy-cordova-source', function () {
	return gulp.src([
			path.join('cordova', 'index.html')
		])
		.pipe(gulp.dest(path.join('dist', 'mobile', 'www')));
});

gulp.task('[private-cordova]:config-for-default', function () {
	return gulp.src(path.join('cordova', 'config.xml'))
		.pipe(gulp.dest(path.join('dist', 'mobile')));
});

gulp.task('[private-cordova]:copy-resources', function () {
	return gulp.src(path.join(config.resourcesFolder, '*.*'))
		.pipe(gulp.dest(path.join(config.cordovaFolder, 'resources')));
});

gulp.task('[private-cordova]:build-android', function (done) {
	//var currentDir = sh.pwd();
	//sh.cd(path.join('dist', 'mobile'));
	//sh.exec('ionic resources android');
	//sh.exec('cordova prepare android');
	//sh.exec('cordova build android');
	//sh.cd(currentDir);
	//done();
	return buildMobileAppFor('android');
});

gulp.task('[private-cordova]:copy-build', function (done) {
	return gulp.src();
});


gulp.task('build-cordova-android', function (done) {
	runSequence(
		'[private]:clean',
		'build-web',
		['[private-cordova]:copy-source', '[private-cordova]:copy-cordova-source', '[private-cordova]:config-for-default', '[private-cordova]:copy-resources'],
		'[private-cordova]:build-android',
		done
	);
});



// -- ELECTRON
// --------------

function buildElectronAppFor(targetPlatform, target) {
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
		.pipe(symdest(path.join(config.appFolder, 'desktop', target)));
}

gulp.task('[private-electron]:copy-source', function () {
	// src for progressive loading
	// bundled files (js and css)
	// global styles
	return gulp.src([
			path.join('src', '**', '*.*'),
			path.join('dist', 'bundles', '**', '*.*'),
			path.join('css', '**', '*.*')
		], {base: './'})
		.pipe(gulp.dest(path.join('dist', 'desktop')));
});

gulp.task('[private-electron]:copy-resources', function () {
	return gulp.src(path.join('resources', '**', '*.*'))
		.pipe(gulp.dest(path.join('dist', 'desktop')));
});

gulp.task('[private-electron]:copy-electron-source', function () {
	return gulp.src(path.join('electron', '**', '*.*'))
		.pipe(gulp.dest(path.join('dist', 'desktop')));
});

gulp.task('[private]:build-electron-windows', function () {
	return buildElectronAppFor('win32', 'windows');
});


gulp.task('build-electron-windows', function (done) {
	runSequence(
		'[private]:clean',
		'build-web',
		['[private-electron]:copy-source', '[private-electron]:copy-resources', '[private-electron]:copy-electron-source'],
		'[private]:build-electron-windows',
		done
	)
});








































gulp.task('lint', function() {
	return gulp.src('./src/*.js')
		.pipe(jshint({
			esversion: 6
		}))
		.pipe(jshint.reporter('default'));
});

gulp.task('css', function() {
	gulp.src('dist/bundles/**/*.css')
		.pipe(csslint())
		.pipe(csslint.reporter());
});