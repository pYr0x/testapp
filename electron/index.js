'use strict';

var electron = require('electron'),
	app = electron.app,
	BrowserWindow = electron.BrowserWindow,
	Menu = electron.Menu,
	Tray = require('tray'),
	globalShortcut = electron.globalShortcut,
	path = require('path');

var mainWindow = null;
var trayIconPath = path.join(__dirname, 'icon.png');
var trayApp = null;

app.on('window-all-closed', function () {
	//https://github.com/atom/electron/issues/2312
	app.quit();
});

app.on('will-quit', function () {
	globalShortcut.unregisterAll();
});

app.on('ready', function () {
	mainWindow = new BrowserWindow({
		title: "BoardZ2",
		width: 1024,
		height: 768,
		nodeIntegration: true
	});

	trayApp = new Tray(trayIconPath);
	trayApp.setToolTip('DoneJS');

	globalShortcut.register('CmdOrCtrl+Shift+d', function () {
		mainWindow.webContents.toggleDevTools();
	});

	mainWindow.loadURL('file://' + __dirname + '/index.html');
	mainWindow.setTitle(app.getName());

	mainWindow.on('closed', function () {
		mainWindow = null;
	});

});
