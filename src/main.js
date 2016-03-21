import $ from "jquery";
import canMap from 'can/map/'
import route from 'can/route/';
//import 'can/route/pushstate/';
import appTemplate from "testapp/app.stache!";


var AppState = canMap.extend({

});

var appState = new AppState();
route.map(appState);

route(':page', { page: 'home' });

// call ready after the appState is fully initialized
route.ready();

$('body').append(appTemplate({
	appState: appState
}));