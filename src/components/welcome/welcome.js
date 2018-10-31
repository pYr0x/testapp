import { Component, route, DefineMap } from 'can';
import './welcome.less';
import view from './welcome.stache';

export const ViewModel = DefineMap.extend({
	next: { default: "up to next page" },
	home: { default: "back to home" },
	content: { default: "hello on Home" },
	goto: function(foo){
		"use strict";

		if(foo === 'next') {
			// progressive loaded content
			steal.loader.import('testapp/foo').then( (module) => {
				this.content = module;
			});
		}

		route.data.page = foo;
		console.log("current page", this.page);
	}
});

export default Component.extend({
	tag: 'welcome',
	ViewModel,
	view
});
