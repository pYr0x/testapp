import { DefineMap } from "can";
import route from "./routes";

let AppState = DefineMap.extend("AppState", {
	page: "string",
	version: {
		get: function() {
			"use strict";
			return '1.0.0';
		}
	}
});

let appState = new AppState();
route.data = appState;

// call ready after the appState is fully initialized
route.start();

export default appState;
