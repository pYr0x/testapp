import "can/map/define/";
import Map from 'can/map/';
import route from "./routes";

const AppState = Map.extend({
	define: {
		title: {
			get: function(){
				console.log(this.attr('page'));
				return "hallo welt"
			}
		},
		version: {
			get: function() {
				"use strict";
				return '1.0.0';
			}
		}
	},
	version: '1.0.0'
});

export default AppState;