import { DefineMap } from "can";

import route from "./routes";

const AppState = DefineMap.extend("AppState", {
	page: "string",
	title: {
		get: function(){
			console.log(this.page);
			return "hallo welt"
		}
	},
	version: {
		get: function() {
			"use strict";
			return '1.0.0';
		}
	}
});

export default AppState;
