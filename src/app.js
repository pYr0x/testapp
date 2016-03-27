import FastClick from "fastclick";
import $ from "jquery";
import "css/styles.less";

import appState from "./appstate_without_autorender";
//import 'can/route/pushstate/';
import appTemplate from "testapp/app.stache";


// import reload from "live-reload";
// or
// "configDependencies": [
//    "live-reload"
// ]


//// do stuff after reaload, e.g. reset app state
//reload(function(){
//	//console.log("call");
//	//appState.attr('page','home');
//	//render();
//});

function render() {
	$('#app').html(appTemplate({
		appState: appState
	}));
	FastClick.attach(document.body);
}

render();