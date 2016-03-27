import "can/map/define/";
import Map from 'can/map/';
import route from "./routes";

let AppState = Map.extend({
	define: {
		version: {
			get: function() {
				"use strict";
				return '1.0.0';
			}
		}
	}
});

let appState = new AppState();
route.map(appState);

// call ready after the appState is fully initialized
route.ready();

export default appState;